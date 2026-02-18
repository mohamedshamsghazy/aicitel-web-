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
    yearsOfExperience: z.coerce.number().int().min(0).max(50).optional(),
    availabilityDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), "Invalid date"),
    salaryExpectationsMin: z.coerce.number().int().min(0).optional(),
    salaryExpectationsMax: z.coerce.number().int().min(0).optional(),
    currentPosition: z.string().max(200).optional(),
    currentCompany: z.string().max(200).optional(),
    coverLetter: z.string().optional(),
    linkedinProfile: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
    portfolioWebsite: z.string().url("Invalid Portfolio URL").optional().or(z.literal('')),
    additionalNotes: z.string().max(2000).optional(),
    jobSlug: z.string().optional(), // To link to specific job
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
            Logger.warn(`API: Rate limit exceeded for IP ${ip} on /api/apply`);
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const incomingFormData = await req.formData();

        // Helper to retrieve form data values safely
        // Returns undefined if value is null or empty string (for optional fields)
        const getOptionalString = (key: string) => {
            const value = incomingFormData.get(key);
            if (value === null || (typeof value === 'string' && value.trim() === '')) {
                return undefined;
            }
            return value as string;
        };

        const getRequiredString = (key: string) => {
            const value = incomingFormData.get(key);
            if (value === null || (typeof value === 'string' && value.trim() === '')) {
                return undefined;
            }
            return value as string;
        };

        const getRequiredNumber = (key: string) => {
            const value = incomingFormData.get(key);
            if (value === null || (typeof value === 'string' && value.trim() === '')) {
                return undefined;
            }
            return value;
        }

        // Handle Legacy Form Field Mapping
        const positionLegacy = incomingFormData.get('position');
        const messageLegacy = incomingFormData.get('message');

        // Used for validation
        const payload = {
            fullName: getRequiredString('fullName'),
            email: getRequiredString('email'),
            phone: getRequiredString('phone'),
            yearsOfExperience: getRequiredNumber('yearsOfExperience'),
            availabilityDate: getOptionalString('availabilityDate'),
            salaryExpectationsMin: incomingFormData.get('salaryExpectationsMin') === '' ? undefined : incomingFormData.get('salaryExpectationsMin'),
            salaryExpectationsMax: incomingFormData.get('salaryExpectationsMax') === '' ? undefined : incomingFormData.get('salaryExpectationsMax'),
            currentPosition: getOptionalString('currentPosition') || (positionLegacy as string), // map legacy 'position'
            currentCompany: getOptionalString('currentCompany'),
            coverLetter: getOptionalString('coverLetter') || (messageLegacy as string), // map legacy 'message'
            linkedinProfile: getOptionalString('linkedinProfile'),
            portfolioWebsite: getOptionalString('portfolioWebsite'),
            additionalNotes: getOptionalString('additionalNotes'),
            jobSlug: getOptionalString('jobSlug'),
            token: incomingFormData.get('token'), // Required
        };

        // 2. Input Validation
        const validationResult = ApplicationSchema.safeParse(payload);
        if (!validationResult.success) {
            Logger.warn(`API: Validation failed on /api/apply`, validationResult.error.flatten());
            return NextResponse.json({ error: 'Validation Failed', details: validationResult.error.flatten() }, { status: 400 });
        }

        const validData = validationResult.data;

        // 3. Bot Protection (Turnstile)
        // Skip on localhost/dev if needed
        if (process.env.NODE_ENV === 'production' || (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !ip.includes('127.0.0.1') && ip !== '::1')) {
            const isHuman = await validateTurnstileToken(validData.token, ip);
            if (!isHuman) {
                return NextResponse.json({ error: 'Security check failed. Please refresh and try again.' }, { status: 400 });
            }
        }

        const cvFile = incomingFormData.get('cv');

        // 4. File Validation (Basic)
        if (cvFile && cvFile instanceof Blob) {
            if (cvFile.size > 10 * 1024 * 1024) { // 10MB limit
                Logger.warn(`API: File too large uploaded by ${validData.email}`);
                return NextResponse.json({ error: 'File too large (Max 10MB)' }, { status: 400 });
            }
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'];
            if (!allowedTypes.includes(cvFile.type)) {
                Logger.warn(`API: Invalid file type ${cvFile.type} uploaded by ${validData.email}`);
                return NextResponse.json({ error: 'Invalid file type. Only PDF and Word documents allowed.' }, { status: 400 });
            }
        }

        // 5. CRM Integration (Primary Data Store logic)
        // We push to CRM first or parallel to Strapi. 
        // Note: Real enterprise standard often puts CRM as source of truth for "Contacts", Strapi for "Application Records".

        const crmSuccess = await CRM.createContact({
            email: validData.email,
            firstname: validData.fullName.split(' ')[0],
            lastname: validData.fullName.split(' ').slice(1).join(' '),
            phone: validData.phone,
            lifecycleStage: 'lead',
            source: 'Career Application',
            // Add custom properties if your CRM supports them
            // years_of_experience: validData.yearsOfExperience,
            // current_company: validData.currentCompany
        });

        if (!crmSuccess) {
            // We log but do NOT fail the request, as Strapi might still work.
            // Alternatively, we could fail if CRM is critical.
            Logger.warn(`API: CRM sync failed for ${validData.email}`);
        }

        // 6. Strapi Submission
        // Use imports from lib/env or process.env with fallback
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

        const headers: Record<string, string> = {};
        if (STRAPI_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        let cvFileId: number | undefined;

        // Step 1: Upload CV to Strapi Upload API if exists
        if (cvFile && cvFile instanceof Blob) {
            try {
                const uploadFormData = new FormData();
                const fileBuffer = await cvFile.arrayBuffer();
                const fileBlob = new Blob([fileBuffer], { type: cvFile.type });

                // Ensure filename has correct extension
                let fileName = (cvFile as any).name || 'cv.pdf';

                // If the file is minimal blob/file without extension, try to append it from type
                if (cvFile.type === 'application/pdf' && !fileName.toLowerCase().endsWith('.pdf')) {
                    fileName += '.pdf';
                } else if (cvFile.type === 'application/msword' && !fileName.toLowerCase().endsWith('.doc')) {
                    fileName += '.doc';
                } else if (
                    cvFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                    !fileName.toLowerCase().endsWith('.docx')
                ) {
                    fileName += '.docx';
                }

                // Strapi /api/upload expects 'files' key
                uploadFormData.append('files', fileBlob, fileName);

                const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
                    method: 'POST',
                    headers: headers.Authorization ? { Authorization: headers.Authorization } : undefined,
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    const uploadError = await uploadResponse.json();
                    Logger.error('API: Strapi File Upload failed', uploadError);
                    Logger.warn(`API: Proceeding without CV due to upload error for ${validData.email}`);
                } else {
                    const uploadResult = await uploadResponse.json();
                    const uploadedFile = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult;
                    if (uploadedFile && uploadedFile.id) {
                        cvFileId = uploadedFile.id;
                        Logger.info(`API: CV uploaded successfully. ID: ${cvFileId}`);
                    }
                }
            } catch (error) {
                Logger.error('API: File upload exception', error);
            }
        }

        // Step 2: Create Application Entry
        const dataPayload: any = {
            fullName: validData.fullName,
            email: validData.email,
            phone: validData.phone,
            yearsOfExperience: validData.yearsOfExperience,
            availabilityDate: validData.availabilityDate,
            salaryExpectationsMin: validData.salaryExpectationsMin,
            salaryExpectationsMax: validData.salaryExpectationsMax,
            currentPosition: validData.currentPosition,
            currentCompany: validData.currentCompany,
            coverLetter: validData.coverLetter,
            linkedinProfile: validData.linkedinProfile,
            portfolioWebsite: validData.portfolioWebsite,
            additionalNotes: validData.additionalNotes,
            stage: 'New'
        };

        if (cvFileId) {
            dataPayload.cv = cvFileId;
        }

        const appHeaders: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (STRAPI_TOKEN) {
            appHeaders['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        Logger.info('API: Strapi Payload Data:', { payload: JSON.stringify(dataPayload) });

        const strapiResponse = await fetch(`${STRAPI_URL}/api/applications`, {
            method: 'POST',
            headers: appHeaders,
            body: JSON.stringify({ data: dataPayload }),
        });

        const data = await strapiResponse.json();


        if (!strapiResponse.ok) {
            Logger.error('API: Strapi submission failed', data);
            // Revert details exposure for security, but keep error message
            return NextResponse.json({ error: 'Submission failed. Please try again later.' }, { status: strapiResponse.status });
        }

        const duration = Date.now() - start;
        Logger.info(`API: Application successful for ${validData.email} in ${duration}ms`);

        return NextResponse.json({ success: true });

    } catch (error) {
        Logger.error('API: Application Submit Fatal Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
