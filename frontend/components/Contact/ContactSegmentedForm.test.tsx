import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import ContactSegmentedForm from './ContactSegmentedForm';

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

const messages = {
    Contact: {
        segmented: {
            tabs: {
                inquiries: 'Inquiries',
                applicants: 'Applicants',
            },
            inquiries: {
                title: 'Send us an inquiry',
                subtitle: 'We will get back to you soon',
                fields: {
                    companyName: 'Company Name',
                    companyNamePlaceholder: 'Your Company',
                    contactPerson: 'Contact Person',
                    contactPersonPlaceholder: 'John Doe',
                    email: 'Email',
                    emailPlaceholder: 'john@example.com',
                    phone: 'Phone',
                    phonePlaceholder: '+49 123 456789',
                    message: 'Message',
                    messagePlaceholder: 'Tell us about your inquiry...',
                    type: 'Inquiry Type',
                },
                types: {
                    partnership: 'Partnership',
                    sales: 'Sales',
                    support: 'Support',
                    general: 'General',
                },
                submit: 'Send Inquiry',
                submitting: 'Sending...',
                success: 'Inquiry sent successfully!',
                error: 'Failed to send inquiry. Please try again.',
            },
            applicants: {
                title: 'Apply for a position',
                subtitle: 'Join our team',
                fields: {
                    fullName: 'Full Name',
                    fullNamePlaceholder: 'John Doe',
                    email: 'Email',
                    emailPlaceholder: 'john@example.com',
                    phone: 'Phone',
                    phonePlaceholder: '+49 123 456789',
                    cv: 'Upload CV',
                    notes: 'Additional Notes',
                    notesPlaceholder: 'Tell us about yourself...',
                },
                submit: 'Submit Application',
                submitting: 'Submitting...',
                success: 'Application submitted successfully!',
                error: 'Failed to submit application. Please try again.',
            },
        },
    },
};

describe('ContactSegmentedForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });
    });

    describe('Tab Switching', () => {
        it('should render with inquiries tab active by default', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            expect(screen.getByText('Send us an inquiry')).toBeInTheDocument();
            expect(screen.queryByText('Apply for a position')).not.toBeInTheDocument();
        });

        it('should show applicants tab when prop is set', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            expect(screen.getByText('Apply for a position')).toBeInTheDocument();
            expect(screen.queryByText('Send us an inquiry')).not.toBeInTheDocument();
        });

        it('should switch between tabs when clicked', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            // Should start with inquiries
            expect(screen.getByText('Send us an inquiry')).toBeInTheDocument();

            // Click applicants tab
            const applicantsTab = screen.getByRole('button', { name: /applicants/i });
            await user.click(applicantsTab);

            // Should now show applicants
            expect(screen.getByText('Apply for a position')).toBeInTheDocument();

            // Click back to inquiries
            const inquiriesTab = screen.getByRole('button', { name: /inquiries/i });
            await user.click(inquiriesTab);

            // Should show inquiries again
            expect(screen.getByText('Send us an inquiry')).toBeInTheDocument();
        });
    });

    describe('Inquiry Form', () => {
        it('should render all inquiry form fields', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            expect(screen.getByPlaceholderText('Your Company')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('+49 123 456789')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Tell us about your inquiry...')).toBeInTheDocument();
        });

        it('should validate required fields', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            // Click Turnstile mock to enable submit button
            const turnstile = screen.getByTestId('turnstile-mock');
            await user.click(turnstile);

            // Try to submit without filling fields
            const submitButton = screen.getByRole('button', { name: /send inquiry/i });
            await user.click(submitButton);

            // Form should not be submitted (fetch not called)
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should submit inquiry form with valid data', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            // Fill in the form
            await user.type(screen.getByPlaceholderText('Your Company'), 'Test Company');
            await user.type(screen.getByPlaceholderText('John Doe'), 'John Smith');
            await user.type(screen.getByPlaceholderText('john@example.com'), 'john@test.com');
            await user.type(screen.getByPlaceholderText('+49 123 456789'), '+49123456789');
            await user.type(screen.getByPlaceholderText('Tell us about your inquiry...'), 'Test inquiry message');

            // Click Turnstile mock
            const turnstile = screen.getByTestId('turnstile-mock');
            await user.click(turnstile);

            // Submit form
            const submitButton = screen.getByRole('button', { name: /send inquiry/i });
            await user.click(submitButton);

            // Wait for submission
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/inquiry',
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: expect.stringContaining('Test Company'),
                    })
                );
            });
        });

        it('should display success message on successful submission', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            // Fill form
            await user.type(screen.getByPlaceholderText('Your Company'), 'Test Company');
            await user.type(screen.getByPlaceholderText('John Doe'), 'John Smith');
            await user.type(screen.getByPlaceholderText('john@example.com'), 'john@test.com');
            await user.type(screen.getByPlaceholderText('+49 123 456789'), '+49123456789');
            await user.type(screen.getByPlaceholderText('Tell us about your inquiry...'), 'Test message');

            // Verify and submit
            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /send inquiry/i }));

            // Check for success message
            await waitFor(() => {
                expect(screen.getByText('Inquiry sent successfully!')).toBeInTheDocument();
            });
        });

        it('should display error message on failed submission', async () => {
            const user = userEvent.setup();

            // Mock fetch to fail
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Server error' }),
            });

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            // Fill and submit form
            await user.type(screen.getByPlaceholderText('Your Company'), 'Test Company');
            await user.type(screen.getByPlaceholderText('John Doe'), 'John Smith');
            await user.type(screen.getByPlaceholderText('john@example.com'), 'john@test.com');
            await user.type(screen.getByPlaceholderText('+49 123 456789'), '+49123456789');
            await user.type(screen.getByPlaceholderText('Tell us about your inquiry...'), 'Test');

            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /send inquiry/i }));

            // Check for error message
            await waitFor(() => {
                expect(screen.getByText('Failed to send inquiry. Please try again.')).toBeInTheDocument();
            });
        });
    });

    describe('Application Form', () => {
        it('should render all application form fields', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('+49 123 456789')).toBeInTheDocument();
            expect(screen.getByText('Upload CV')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Tell us about yourself...')).toBeInTheDocument();
        });

        it('should handle file upload', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            // Create a mock file
            const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });

            // Find file input
            const fileInput = screen.getByLabelText(/upload cv/i);

            // Upload file
            await user.upload(fileInput, file);

            // Verify file is attached
            expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
            expect((fileInput as HTMLInputElement).files).toHaveLength(1);
        });

        it('should submit application form with valid data', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm defaultTab="applicants" />
                </NextIntlClientProvider>
            );

            // Fill form
            await user.type(screen.getByPlaceholderText('John Doe'), 'Jane Doe');
            await user.type(screen.getByPlaceholderText('john@example.com'), 'jane@test.com');
            await user.type(screen.getByPlaceholderText('+49 123 456789'), '+49987654321');
            await user.type(screen.getByPlaceholderText('Tell us about yourself...'), 'I am experienced');

            // Upload CV
            const file = new File(['cv'], 'cv.pdf', { type: 'application/pdf' });
            await user.upload(screen.getByLabelText(/upload cv/i), file);

            // Verify and submit
            await user.click(screen.getByTestId('turnstile-mock'));
            await user.click(screen.getByRole('button', { name: /submit application/i }));

            // Check API was called
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/apply',
                    expect.objectContaining({
                        method: 'POST',
                    })
                );
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            // Check for tab buttons
            const inquiriesTab = screen.getByRole('button', { name: /inquiries/i });
            const applicantsTab = screen.getByRole('button', { name: /applicants/i });

            expect(inquiriesTab).toBeInTheDocument();
            expect(applicantsTab).toBeInTheDocument();
        });

        it('should support keyboard navigation between tabs', async () => {
            const user = userEvent.setup();

            render(
                <NextIntlClientProvider locale="en" messages={messages}>
                    <ContactSegmentedForm />
                </NextIntlClientProvider>
            );

            const inquiriesTab = screen.getByRole('button', { name: /inquiries/i });
            const applicantsTab = screen.getByRole('button', { name: /applicants/i });

            // Focus first tab
            inquiriesTab.focus();
            expect(document.activeElement).toBe(inquiriesTab);

            // Tab to next tab button
            await user.tab();
            expect(document.activeElement).toBe(applicantsTab);
        });
    });
});
