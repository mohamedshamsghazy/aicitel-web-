import { Logger } from './logger';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function validateTurnstileToken(token: string, ip?: string): Promise<boolean> {
    if (!TURNSTILE_SECRET_KEY) {
        Logger.warn('SECURITY: Turnstile Secret Key missing. Skipping validation (DEV MODE).');
        // Fail open in dev, Fail closed in prod if strictly required
        return process.env.NODE_ENV !== 'production';
    }

    try {
        const formData = new FormData();
        formData.append('secret', TURNSTILE_SECRET_KEY);
        formData.append('response', token);
        if (ip) formData.append('remoteip', ip);

        const result = await fetch(TURNSTILE_VERIFY_URL, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();

        if (!outcome.success) {
            Logger.warn(`SECURITY: Turnstile validation failed for IP ${ip}`, outcome);
            return false;
        }

        Logger.info(`SECURITY: Turnstile validated for IP ${ip}`);
        return true;

    } catch (error) {
        Logger.error('SECURITY: Turnstile verification error', error);
        return false; // Fail closed on error? Or open? Usually fail closed for security.
    }
}
