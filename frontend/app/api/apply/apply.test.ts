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

describe('/api/apply', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (process.env as any).NODE_ENV = 'test';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const createFormData = (data: Record<string, any>) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });
        return formData;
    };

    const createMockRequest = (formData: FormData, options: any = {}) => {
        return {
            formData: vi.fn().mockResolvedValue(formData),
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
        it('should accept valid application data without CV', async () => {
            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+49123456789',
                notes: 'I am interested in this position',
                token: 'valid-turnstile-token',
            });

            const mockRequest = createMockRequest(formData);

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

        it('should accept valid application data with CV', async () => {
            const cvFile = new File(['test content'], 'cv.pdf', {
                type: 'application/pdf',
            });

            const formData = createFormData({
                fullName: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+49123456789',
                token: 'valid-turnstile-token',
            });
            formData.append('cv', cvFile);

            const mockRequest = createMockRequest(formData);

            // Mock Strapi response
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 2 } }),
            });

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });

        it('should reject application with missing required fields', async () => {
            const formData = createFormData({
                fullName: 'John',
                // Missing email
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject application with invalid email', async () => {
            const formData = createFormData({
                fullName: 'John Doe',
                email: 'invalid-email',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject application with too short name', async () => {
            const formData = createFormData({
                fullName: 'J',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject application with too short phone', async () => {
            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '123',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });

        it('should reject application with missing token', async () => {
            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                // Missing token
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Validation Failed');
        });
    });

    describe('File Upload Validation', () => {
        it('should reject CV file that is too large', async () => {
            // Create a file larger than 5MB
            const largeFile = new File(
                [new ArrayBuffer(6 * 1024 * 1024)],
                'large-cv.pdf',
                { type: 'application/pdf' }
            );

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });
            formData.append('cv', largeFile);

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('File too large');
        });

        it('should reject invalid file type', async () => {
            const invalidFile = new File(['test'], 'test.exe', {
                type: 'application/x-msdownload',
            });

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });
            formData.append('cv', invalidFile);

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Invalid file type');
        });

        it('should accept PDF file', async () => {
            const pdfFile = new File(['test content'], 'cv.pdf', {
                type: 'application/pdf',
            });

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });
            formData.append('cv', pdfFile);

            const mockRequest = createMockRequest(formData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            const response = await POST(mockRequest);
            expect(response.status).toBe(200);
        });

        it('should accept Word document (.doc)', async () => {
            const docFile = new File(['test content'], 'cv.doc', {
                type: 'application/msword',
            });

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });
            formData.append('cv', docFile);

            const mockRequest = createMockRequest(formData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            const response = await POST(mockRequest);
            expect(response.status).toBe(200);
        });

        it('should accept Word document (.docx)', async () => {
            const docxFile = new File(['test content'], 'cv.docx', {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });
            formData.append('cv', docxFile);

            const mockRequest = createMockRequest(formData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            const response = await POST(mockRequest);
            expect(response.status).toBe(200);
        });
    });

    describe('Rate Limiting', () => {
        it('should return 429 when rate limit is exceeded', async () => {
            const rateLimit = (await import('@/lib/rate-limit')).default;
            const limiter = rateLimit({
                interval: 60 * 1000,
                uniqueTokenPerInterval: 500,
            });

            vi.mocked(limiter.check).mockRejectedValueOnce(new Error('Rate limit exceeded'));

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);
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

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'invalid-token',
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Security check failed');
        });
    });

    describe('Strapi Integration', () => {
        it('should handle Strapi submission failure', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: vi.fn().mockResolvedValue({ error: 'Internal server error' }),
            });

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);
            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Submission failed. Please try again later.');
        });

        it('should submit data to Strapi with correct format', async () => {
            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                notes: 'Test notes',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            });

            await POST(mockRequest);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/applications'),
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });

    describe('CRM Integration', () => {
        it('should call CRM.createContact with correct data', async () => {
            const { CRM } = await import('@/lib/crm');

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);

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
                lifecycleStage: 'lead',
                source: 'Career Application',
            });
        });

        it('should continue processing even if CRM fails', async () => {
            const { CRM } = await import('@/lib/crm');
            vi.mocked(CRM.createContact).mockResolvedValueOnce(false);

            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);

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
            const formData = createFormData({
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+49123456789',
                token: 'valid-token',
            });

            const mockRequest = createMockRequest(formData);

            // Simulate unexpected error
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            const response = await POST(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal Server Error');
        });
    });
});
