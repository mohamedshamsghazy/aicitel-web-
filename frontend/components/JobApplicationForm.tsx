'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import TurnstileWidget from '@/components/TurnstileWidget';

interface JobApplicationFormProps {
    jobTitle: string;
    jobSlug: string;
}

export default function JobApplicationForm({ jobTitle, jobSlug }: JobApplicationFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    // For calculating min availability date (today)
    const today = new Date().toISOString().split('T')[0];

    const t = useTranslations('JobApplicationForm');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setMessage(t('errorSecurityCheck')); // Ensure this key exists or use fallback
            setStatus('error');
            return;
        }

        setStatus('loading');

        try {
            const formData = new FormData(e.currentTarget);
            formData.append('token', token);
            formData.append('jobSlug', jobSlug);

            // Clean up empty optional fields to avoid validation errors if they are empty strings
            // However, FormData sends empty strings for empty inputs, and Zod handles them with .optional() or .or(z.literal(''))

            const response = await fetch('/api/apply', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Submission failed');
            }

            setStatus('success');
            // Check if we need to redirect or show success message inline
            // For now, inline success message
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : t('errorMessage'));
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('successTitle')}</h3>
                <p className="text-gray-600 mb-8">{t('successMessage', { jobTitle })}</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-primary font-medium hover:underline"
                >
                    {t('submitAnother')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
            <div className="border-b border-gray-100 pb-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{t('formTitle')}</h3>
                <p className="text-gray-500 mt-1">{t('applyingFor')} <span className="font-semibold text-primary">{jobTitle}</span></p>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">1</span>
                    {t('sections.personalInfo')}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.fullName')} <span className="text-red-500">*</span></label>
                        <input required name="fullName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.email')} <span className="text-red-500">*</span></label>
                        <input required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.phone')} <span className="text-red-500">*</span></label>
                    <input required name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">2</span>
                    {t('sections.professionalDetails')}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.currentPosition')}</label>
                        <input name="currentPosition" type="text" placeholder={t('placeholders.currentPosition')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.currentCompany')}</label>
                        <input name="currentCompany" type="text" placeholder={t('placeholders.currentCompany')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.yearsOfExperience')} <span className="text-red-500">*</span></label>
                        <input required name="yearsOfExperience" type="number" min="0" max="50" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.availabilityDate')} <span className="text-red-500">*</span></label>
                        <input required name="availabilityDate" type="date" min={today} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.salaryExpectationsMin')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input name="salaryExpectationsMin" type="number" min="0" placeholder="Min" className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.salaryExpectationsMax')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input name="salaryExpectationsMax" type="number" min="0" placeholder="Max" className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Links & Portfolio */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">3</span>
                    {t('sections.links')}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.linkedinProfile')}</label>
                        <input name="linkedinProfile" type="url" placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.portfolioWebsite')}</label>
                        <input name="portfolioWebsite" type="url" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                    </div>
                </div>
            </div>

            {/* Application Materials */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">4</span>
                    {t('sections.materials')}
                </h4>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.cv')} <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                        <input
                            required
                            name="cv"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="pointer-events-none">
                            <span className="block text-2xl mb-2">📄</span>
                            <span className="text-sm text-gray-600 font-medium">{t('placeholders.uploadCV')}</span>
                            <span className="block text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 10MB)</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.coverLetter')}</label>
                    <textarea name="coverLetter" rows={4} placeholder={t('placeholders.coverLetter')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.additionalNotes')}</label>
                    <textarea name="additionalNotes" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"></textarea>
                </div>
            </div>

            <div className="pt-4">
                <TurnstileWidget onVerify={(token) => setToken(token)} />
            </div>

            {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{message}</span>
                </div>
            )}

            <button
                disabled={status === 'loading'}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl hover:bg-primary-light transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        {t('buttons.submitting')}
                    </span>
                ) : t('buttons.submit')}
            </button>
        </form>
    );
}
