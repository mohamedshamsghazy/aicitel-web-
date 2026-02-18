import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';
import { Logger } from '@/lib/logger';
import { CRM } from '@/lib/crm';
import { validateTurnstileToken } from '@/lib/turnstile';

// Rate Limiter: 10 requests per minute per IP
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Zod Validation Schema
const InquirySchema = z.object({
    company: z.string().min(2, "Company name is required").max(100),
    fullName: z.string().min(2, "Contact person is required").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(6).max(20),
    message: z.string().min(10, "Message is too short").max(2000),
    type: z.string().optional(),
    token: z.string().min(1, "Anti-bot token missing"), // Turnstile Token
});

export async function POST(req: NextRequest) {
    const start = Date.now();
    let ip = 'unknown';

    try {
        // 1. Rate Limiting
        ip = req.headers.get('x-forwarded-for') || (req as any).ip || '127.0.0.1';
        try {
            await limiter.check(5, ip);
        } catch {
            Logger.warn(`API: Rate limit exceeded for IP ${ip} on /api/inquiry`);
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const body = await req.json();

        // 2. Input Validation
        const validationResult = InquirySchema.safeParse(body);
        if (!validationResult.success) {
            Logger.warn(`API: Validation failed on /api/inquiry`, validationResult.error.flatten());
            return NextResponse.json({ error: 'Validation Failed', details: validationResult.error.flatten() }, { status: 400 });
        }

        const validData = validationResult.data;

        // 3. Bot Protection
        // Skip on localhost/dev if needed
        if (process.env.NODE_ENV === 'production' || (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !ip.includes('127.0.0.1') && ip !== '::1')) {
            const isHuman = await validateTurnstileToken(validData.token, ip);
            if (!isHuman) {
                return NextResponse.json({ error: 'Security check failed. Please refresh and try again.' }, { status: 400 });
            }
        }

        // 4. CRM Integration
        const crmSuccess = await CRM.createContact({
            email: validData.email,
            firstname: validData.fullName.split(' ')[0],
            lastname: validData.fullName.split(' ').slice(1).join(' '),
            phone: validData.phone,
            company: validData.company,
            lifecycleStage: 'lead',
            source: 'Inquiry Form'
        });

        if (!crmSuccess) {
            Logger.warn(`API: CRM sync failed for ${validData.email}`);
        }

        // 5. Strapi Submission
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

        // Note: STRAPI_TOKEN is optional if Public permissions are enabled
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (STRAPI_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        let strapiEndpoint = 'api/general-inquiries';
        let strapiPayload = {
            data: {
                companyName: validData.company,
                contactPerson: validData.fullName,
                email: validData.email,
                phone: validData.phone,
                message: validData.message,
                // type field removed as it is not part of general-inquiry schema
            }
        };

        if (validData.type === 'Partner') {
            strapiEndpoint = 'api/partners';
            strapiPayload = {
                data: {
                    companyName: validData.company,
                    contactPerson: validData.fullName,
                    email: validData.email,
                    phone: validData.phone,
                    message: validData.message,
                    // No 'type' field in Partner content type
                }
            };
        }

        const strapiResponse = await fetch(`${STRAPI_URL}/${strapiEndpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(strapiPayload),
        });

        const data = await strapiResponse.json();

        if (!strapiResponse.ok) {
            Logger.error('API: Strapi Inquiry submission failed', data);
            return NextResponse.json({ error: 'Submission failed. Please try again later.' }, { status: strapiResponse.status });
        }

        const duration = Date.now() - start;
        Logger.info(`API: Inquiry successful for ${validData.email} in ${duration}ms`);

        return NextResponse.json({ success: true });

    } catch (error) {
        Logger.error('API: Inquiry Submit Fatal Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
