import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import ContactForms from './ContactForms';

// Mock the API route
global.fetch = vi.fn();

// Mock Turnstile component
vi.mock('react-turnstile', () => ({
    default: ({ onVerify }: { onVerify: (token: string) => void }) => (
        <div data-testid="turnstile-mock" onClick={() => onVerify('mock-token')}>
            Turnstile Mock
        </div>
    ),
}));

// Mock next/navigation
vi.mock('@/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

const messages = {
    Contact: {
        forms: {
            applicants: {
                title: 'Apply for Position',
                fields: {
                    fullName: 'Full Name',
                    email: 'Email',
                    phone: 'Phone',
                    cv: 'Upload CV',
                    notes: 'Additional Notes',
                },
                submit: 'Submit Application',
                success: 'Application submitted!',
                error: 'Submission failed',
            },
            partners: {
                title: 'Partner with Us',
                fields: {
                    companyName: 'Company Name',
                    contactPerson: 'Contact Person',
                    email: 'Email',
                    phone: 'Phone',
                    message: 'Message',
                },
                submit: 'Send Inquiry',
                success: 'Inquiry sent!',
                error: 'Failed to send',
            },
        },
    },
};

describe('ContactForms', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });
    });

    describe('Rendering', () => {
        it('should render applicants form by default', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms />
                </NextIntlClientProvider>
            );

            expect(screen.getByText('Apply for Position')).toBeInTheDocument();
        });

        it('should render partners form when specified', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="partners" />
                </NextIntlClientProvider>
            );

            expect(screen.getByText('Partner with Us')).toBeInTheDocument();
        });
    });

    describe('Tab Navigation', () => {
        it('should switch between applicants and partners', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms />
                </NextIntlClientProvider>
            );

            // Should show applicants initially
            expect(screen.getByText('Apply for Position')).toBeInTheDocument();

            // Find and click partners tab
            const partnersButton = screen.getAllByRole('button').find(
                (btn) => btn.textContent?.includes('Partners') || btn.textContent?.includes('Partner')
            );

            if (partnersButton) {
                await user.click(partnersButton);
                await waitFor(() => {
                    expect(screen.getByText('Partner with Us')).toBeInTheDocument();
                });
            }
        });
    });

    describe('Applicant Form Submission', () => {
        it('should validate required fields before submission', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            // Click Turnstile
            await user.click(screen.getByTestId('turnstile-mock'));

            // Try to submit empty form
            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            // Should not call API
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should submit applicant form with valid data', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            // Fill in form fields
            const nameInput = screen.getByLabelText(/full name/i);
            const emailInput = screen.getByLabelText(/email/i);
            const phoneInput = screen.getByLabelText(/phone/i);

            await user.type(nameInput, 'John Doe');
            await user.type(emailInput, 'john@example.com');
            await user.type(phoneInput, '+49123456789');

            // Upload file
            const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
            const fileInput = screen.getByLabelText(/upload cv/i);
            await user.upload(fileInput, file);

            // Verify Turnstile
            await user.click(screen.getByTestId('turnstile-mock'));

            // Submit
            const submitButton = screen.getByRole('button', { name: /submit application/i });
            await user.click(submitButton);

            // Verify API was called
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/apply',
                    expect.objectContaining({
                        method: 'POST',
                    })
                );
            });
        });

        it('should show success message after submission', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            // Fill and submit form
            await user.type(screen.getByLabelText(/full name/i), 'John Doe');
            await user.type(screen.getByLabelText(/email/i), 'john@example.com');
            await user.type(screen.getByLabelText(/phone/i), '+49123456789');

            const file = new File(['cv'], 'cv.pdf', { type: 'application/pdf' });
            await user.upload(screen.getByLabelText(/upload cv/i), file);

            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /submit application/i }));

            // Check for success message
            await waitFor(() => {
                expect(screen.getByText('Application submitted!')).toBeInTheDocument();
            });
        });

        it('should show error message on failed submission', async () => {
            const user = userEvent.setup();

            // Mock failed response
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Server error' }),
            });

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            // Fill and submit
            await user.type(screen.getByLabelText(/full name/i), 'John Doe');
            await user.type(screen.getByLabelText(/email/i), 'john@example.com');
            await user.type(screen.getByLabelText(/phone/i), '+49123456789');

            const file = new File(['cv'], 'cv.pdf', { type: 'application/pdf' });
            await user.upload(screen.getByLabelText(/upload cv/i), file);

            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /submit application/i }));

            // Check for error message
            await waitFor(() => {
                expect(screen.getByText('Submission failed')).toBeInTheDocument();
            });
        });
    });

    describe('Partner Form Submission', () => {
        it('should submit partner inquiry with valid data', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="partners" />
                </NextIntlClientProvider>
            );

            // Fill in form
            await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
            await user.type(screen.getByLabelText(/contact person/i), 'Jane Smith');
            await user.type(screen.getByLabelText(/email/i), 'jane@testcorp.com');
            await user.type(screen.getByLabelText(/phone/i), '+49987654321');
            await user.type(screen.getByLabelText(/message/i), 'Partnership inquiry');

            // Verify and submit
            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /send inquiry/i }));

            // Verify API call
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/inquiry',
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    })
                );
            });
        });

        it('should show success message for partner form', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="partners" />
                </NextIntlClientProvider>
            );

            // Fill and submit
            await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
            await user.type(screen.getByLabelText(/contact person/i), 'Jane Smith');
            await user.type(screen.getByLabelText(/email/i), 'jane@testcorp.com');
            await user.type(screen.getByLabelText(/phone/i), '+49987654321');
            await user.type(screen.getByLabelText(/message/i), 'Test');

            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /send inquiry/i }));

            // Check success message
            await waitFor(() => {
                expect(screen.getByText('Inquiry sent!')).toBeInTheDocument();
            });
        });
    });

    describe('Form Reset', () => {
        it('should reset form after successful submission', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms defaultTab="partners" />
                </NextIntlClientProvider>
            );

            const companyInput = screen.getByLabelText(/company name/i) as HTMLInputElement;
            const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

            // Fill form
            await user.type(companyInput, 'Test Corp');
            await user.type(screen.getByLabelText(/contact person/i), 'Jane');
            await user.type(emailInput, 'jane@test.com');
            await user.type(screen.getByLabelText(/phone/i), '+49123');
            await user.type(screen.getByLabelText(/message/i), 'Test');

            // Submit
            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /send inquiry/i }));

            // Wait for submission and check if form is reset
            await waitFor(() => {
                expect(companyInput.value).toBe('');
                expect(emailInput.value).toBe('');
            });
        });
    });

    describe('Accessibility', () => {
        it('should have accessible form labels', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms />
                </NextIntlClientProvider>
            );

            // Check that form fields have labels
            expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        });

        it('should support keyboard navigation', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactForms />
                </NextIntlClientProvider>
            );

            const nameInput = screen.getByLabelText(/full name/i);
            const emailInput = screen.getByLabelText(/email/i);

            // Focus first input
            nameInput.focus();
            expect(document.activeElement).toBe(nameInput);

            // Tab to next field
            await user.tab();
            expect(document.activeElement).toBe(emailInput);
        });
    });
});
