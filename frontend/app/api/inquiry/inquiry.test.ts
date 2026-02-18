import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/rate-limit', () => ({
    default: () => ({
        check: vi.fn().mockResolvedValue(undefined),
    }),
}));

vi.mock('@/lib/logger', () => ({
    Logger: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    },
}));

vi.mock('@/lib/crm', () => ({
    CRM: {
        createContact: vi.fn().mockResolvedValue(true),
    },
}));

vi.mock('@/lib/turnstile', () => ({
    validateTurnstileToken: vi.fn().mockResolvedValue(true),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('/api/inquiry', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (process.env as any).NODE_ENV = 'test';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const createMockRequest = (body: any, options: any = {}) => {
        return {
            json: vi.fn().mockResolvedValue(body),
            headers: {
                get: vi.fn((header: string) => {
                    if (header === 'x-forwarded-for') return '127.0.0.1';
                    return null;
                }),
            },
            ...options,
        } as unknown as NextRequest;
    };

    describe('Input Validation', () => {
        it('should accept valid inquiry data', async () => {
            const inquiryData = {
                companyName: 'Test Company GmbH',
                contactPerson: 'John Doe',
                email: 'john.doe@testcompany.com',
                phone: '+49123456789',
                message: 'We are interested in your direct sales services.',
                type: 'Partnership',
                token: 'valid-turnstile-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            // Mock Strapi response
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });

        it('should accept inquiry without optional type field', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'Jane Smith',
                email: 'jane@testcompany.com',
                phone: '+49123456789',
                message: 'Interested in your services for our sales team.',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 2 } }),
            });

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });

        it('should reject inquiry with missing company name', async () => {
            const inquiryData = {
                // Missing companyName
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message here',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with missing contact person', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                // Missing contactPerson
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with invalid email', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'invalid-email-format',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with too short phone number', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '123',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with too short message', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Short',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with too long message', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'a'.repeat(2001), // Exceeds 2000 character limit
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with missing token', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'This is a test inquiry message.',
                // Missing token
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject inquiry with too short company name', async () => {
            const inquiryData = {
                companyName: 'A',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message here',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });
    });

    describe('Rate Limiting', () => {
        it('should return 429 when rate limit is exceeded', async () => {
            const rateLimit = (await import('@/lib/rate-limit')).default;
            const limiter = rateLimit({
                interval: 60 * 1000,
                uniqueTokenPerInterval: 500,
            });

            vi.mocked(limiter.check).mockRejectedValueOnce(
                new Error('Rate limit exceeded')
            );

            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(429);
            expect(data.error).toContain('Too many requests');
        });
    });

    describe('Turnstile Verification', () => {
        it('should reject invalid Turnstile token in production', async () => {
            (process.env as any).NODE_ENV = 'production';
            const { validateTurnstileToken } = await import('@/lib/turnstile');
            vi.mocked(validateTurnstileToken).mockResolvedValueOnce(false);

            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'invalid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Security check failed');
        });

        it('should accept valid Turnstile token', async () => {
            const { validateTurnstileToken } = await import('@/lib/turnstile');
            vi.mocked(validateTurnstileToken).mockResolvedValueOnce(true);

            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            const response = await POST(mockRequest);
            expect(response.status).toBe(200);
        });
    });

    describe('Strapi Integration', () => {
        it('should handle Strapi submission failure', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: vi.fn().mockResolvedValue({ error: 'Internal server error' }),
            });

            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Submission failed. Please try again later.');
        });

        it('should submit data to Strapi with correct endpoint', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/inquiries'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                    }),
                })
            );
        });

        it('should not include token in Strapi payload', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                type: 'Partnership',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            const fetchCall = (global.fetch as any).mock.calls[0];
            const body = JSON.parse(fetchCall[1].body);

            expect(body.data.token).toBeUndefined();
        });
    });

    describe('CRM Integration', () => {
        it('should call CRM.createContact with correct data', async () => {
            const { CRM } = await import('@/lib/crm');

            const inquiryData = {
                companyName: 'Test Company GmbH',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            expect(CRM.createContact).toHaveBeenCalledWith({
                email: 'john@example.com',
                firstname: 'John',
                lastname: 'Doe',
                phone: '+49123456789',
                company: 'Test Company GmbH',
                lifecycleStage: 'lead',
                source: 'Inquiry Form',
            });
        });

        it('should handle names with multiple parts correctly', async () => {
            const { CRM } = await import('@/lib/crm');

            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Michael Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            expect(CRM.createContact).toHaveBeenCalledWith(
                expect.objectContaining({
                    firstname: 'John',
                    lastname: 'Michael Doe',
                })
            );
        });

        it('should continue processing even if CRM fails', async () => {
            const { CRM } = await import('@/lib/crm');
            vi.mocked(CRM.createContact).mockResolvedValueOnce(false);

            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle unexpected errors gracefully', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            // Simulate unexpected error
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal Server Error');
        });

        it('should handle malformed JSON gracefully', async () => {
            const mockRequest = {
                json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
                headers: {
                    get: vi.fn().mockReturnValue('127.0.0.1'),
                },
            } as unknown as NextRequest;

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal Server Error');
        });
    });

    describe('Type Field Handling', () => {
        it('should default type to "General" when not provided', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            const fetchCall = (global.fetch as any).mock.calls[0];
            const body = JSON.parse(fetchCall[1].body);

            expect(body.data.type).toBe('General');
        });

        it('should preserve provided type value', async () => {
            const inquiryData = {
                companyName: 'Test Company',
                contactPerson: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                message: 'Test message',
                type: 'Partnership',
                token: 'valid-token',
            };

            const mockRequest = createMockRequest(inquiryData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            const fetchCall = (global.fetch as any).mock.calls[0];
            const body = JSON.parse(fetchCall[1].body);

            expect(body.data.type).toBe('Partnership');
        });
    });
});
