import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import rateLimit from '@/lib/rate-limit';
import { Logger } from '@/lib/logger';
import { CRM } from '@/lib/crm';
import { validateTurnstileToken } from '@/lib/turnstile';

// Rate Limiter: 5 requests per minute per IP
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Zod Schema for Validation
const ApplicationSchema = z.object({
    fullName: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(6, "Phone number is too short").max(20),
    notes: z.string().max(1000).optional(),
    token: z.string().min(1, "Anti-bot token missing"), // Turnstile Token
});

export async function POST(req: NextRequest) {
    const start = Date.now();
    let ip = 'unknown';

    try {
        // 1. Rate Limiting
        ip = req.headers.get('x-forwarded-for') || 'anonymous';
        try {
            await limiter.check(5, ip);
        } catch {
            Logger.warn(`API: Rate limit exceeded for IP ${ip} on /api/apply`);
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const incomingFormData = await req.formData();

        // Used for validation
        const payload = {
            fullName: incomingFormData.get('fullName'),
            email: incomingFormData.get('email'),
            phone: incomingFormData.get('phone'),
            notes: incomingFormData.get('notes'),
            token: incomingFormData.get('token'),
        };

        // 2. Input Validation
        const validationResult = ApplicationSchema.safeParse(payload);
        if (!validationResult.success) {
            Logger.warn(`API: Validation failed on /api/apply`, validationResult.error.flatten());
            return NextResponse.json({ error: 'Validation Failed', details: validationResult.error.flatten() }, { status: 400 });
        }

        const { fullName, email, phone, notes, token } = validationResult.data;

        // 3. Bot Protection (Turnstile)
        const isHuman = await validateTurnstileToken(token, ip);
        if (!isHuman) {
            return NextResponse.json({ error: 'Security check failed. Please refresh and try again.' }, { status: 400 });
        }

        const cvFile = incomingFormData.get('cv');

        // 4. File Validation (Basic)
        if (cvFile && cvFile instanceof Blob) {
            if (cvFile.size > 5 * 1024 * 1024) { // 5MB limit
                Logger.warn(`API: File too large uploaded by ${email}`);
                return NextResponse.json({ error: 'File too large (Max 5MB)' }, { status: 400 });
            }
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(cvFile.type)) {
                Logger.warn(`API: Invalid file type ${cvFile.type} uploaded by ${email}`);
                return NextResponse.json({ error: 'Invalid file type. Only PDF and Word documents allowed.' }, { status: 400 });
            }
        }

        // 5. CRM Integration (Primary Data Store logic)
        // We push to CRM first or parallel to Strapi. 
        // Note: Real enterprise standard often puts CRM as source of truth for "Contacts", Strapi for "Application Records".

        const crmSuccess = await CRM.createContact({
            email,
            firstname: fullName.split(' ')[0],
            lastname: fullName.split(' ').slice(1).join(' '),
            phone,
            lifecycleStage: 'lead',
            source: 'Career Application'
        });

        if (!crmSuccess) {
            // We log but do NOT fail the request, as Strapi might still work.
            // Alternatively, we could fail if CRM is critical.
            Logger.warn(`API: CRM sync failed for ${email}`);
        }

        // 6. Strapi Submission
        const strapiFormData = new FormData();
        const dataPayload = {
            fullName,
            email,
            phone,
            internalNotes: notes ? [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text: notes }]
                }
            ] : undefined,
            stage: 'New'
        };

        strapiFormData.append('data', JSON.stringify(dataPayload));

        if (cvFile && cvFile instanceof Blob) {
            strapiFormData.append('files.cv', cvFile, (cvFile as any).name || 'cv.pdf');
        }

        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
        const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

        if (!STRAPI_URL) {
            Logger.critical('API: NEXT_PUBLIC_STRAPI_URL is not set.');
            return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
        }

        if (!STRAPI_TOKEN) {
            Logger.critical('API: STRAPI_API_TOKEN is not set.');
            return NextResponse.json({ error: 'Internal Server Configuration Error' }, { status: 500 });
        }

        const strapiResponse = await fetch(`${STRAPI_URL}/api/applications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
            },
            body: strapiFormData,
        });

        const data = await strapiResponse.json();

        if (!strapiResponse.ok) {
            Logger.error('API: Strapi submission failed', data);
            return NextResponse.json({ error: 'Submission failed. Please try again later.' }, { status: strapiResponse.status });
        }

        const duration = Date.now() - start;
        Logger.info(`API: Application successful for ${email} in ${duration}ms`);

        return NextResponse.json({ success: true });

    } catch (error) {
        Logger.error('API: Application Submit Fatal Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
