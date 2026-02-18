'use client';

import { useState } from 'react';
import { submitApplication, submitInquiry } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import TurnstileWidget from '@/components/TurnstileWidget';

interface ContactFormsProps {
    defaultTab?: 'applicants' | 'partners';
}

export default function ContactForms({ defaultTab = 'applicants' }: ContactFormsProps) {
    const [activeTab, setActiveTab] = useState<'applicants' | 'partners'>(defaultTab);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    const t = useTranslations('ContactForms');

    const router = useRouter();

    const handleApplicantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setMessage("Please complete the security check.");
            setStatus('error');
            return;
        }

        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        formData.append('type', 'Applicant');
        formData.append('token', token);

        try {
            await submitApplication(formData);
            setStatus('success');
            router.push('/thank-you');
        } catch (error) {
            setStatus('error');
            setMessage(t('errorMessage'));
        }
    };

    const handlePartnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setMessage("Please complete the security check.");
            setStatus('error');
            return;
        }

        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data.token = token;
        data.type = 'Partner';

        try {
            await submitInquiry(data);
            setStatus('success');
            router.push('/thank-you');
        } catch (error) {
            setStatus('error');
            setMessage(t('errorMessage'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => { setActiveTab('applicants'); setStatus('idle'); }}
                    className={`flex-1 py-6 text-center font-bold text-lg transition-colors ${activeTab === 'applicants' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {t('tabApplicants')}
                </button>
                <button
                    onClick={() => { setActiveTab('partners'); setStatus('idle'); }}
                    className={`flex-1 py-6 text-center font-bold text-lg transition-colors ${activeTab === 'partners' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    {t('tabPartners')}
                </button>
            </div>

            <div className="grid md:grid-cols-2">
                <div className="p-10 bg-primary text-white relative overflow-hidden">
                    {/* Abstract background element */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent/20 rounded-tr-full -ml-5 -mb-5"></div>

                    <h3 className="text-2xl font-bold mb-8 text-white relative z-10">{t('contactInfoTitle')}</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <span className="text-lg">📍</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white/90 text-sm uppercase tracking-wide mb-1">{t('contactLabels.visitUs')}</h4>
                                <p className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('contactLabels.address') }} />
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <span className="text-lg">📧</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white/90 text-sm uppercase tracking-wide mb-1">{t('contactLabels.emailUs')}</h4>
                                <a href="mailto:info@aicitel-company.com" className="text-white hover:underline">info@aicitel-company.com</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <span className="text-lg">📞</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white/90 text-sm uppercase tracking-wide mb-1">{t('contactLabels.callUs')}</h4>
                                <p className="text-slate-300">0345 4700 9014</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <div className="text-green-500 text-5xl mb-4">✓</div>
                            <h4 className="text-xl font-bold mb-2">{t('successTitle')}</h4>
                            <p className="text-gray-600">{message}</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-primary underline"
                            >
                                {t('newMessageButton')}
                            </button>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'applicants' ? (
                                <form onSubmit={handleApplicantSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.name')}</label>
                                        <input required name="fullName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.email')}</label>
                                        <input required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.phone')}</label>
                                        <input required name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.cv')}</label>
                                        <input name="cv" type="file" accept=".pdf,.doc,.docx" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.messageOptional')}</label>
                                        <textarea name="notes" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition"></textarea>
                                    </div>

                                    <TurnstileWidget onVerify={(token) => setToken(token)} />
                                    <button disabled={status === 'loading'} type="submit" className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-light transition-colors font-medium disabled:opacity-50">
                                        {status === 'loading' ? t('buttons.sending') : t('buttons.submitApplicant')}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.company')}</label>
                                        <input required name="companyName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.contactPerson')}</label>
                                        <input required name="contactPerson" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.email')}</label>
                                        <input required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.phone')}</label>
                                        <input required name="phone" type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.messageRequired')}</label>
                                        <textarea required name="message" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none transition"></textarea>
                                    </div>

                                    <TurnstileWidget onVerify={(token) => setToken(token)} />

                                    <button disabled={status === 'loading'} type="submit" className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-light transition-colors font-medium disabled:opacity-50">
                                        {status === 'loading' ? t('buttons.sending') : t('buttons.submitPartner')}
                                    </button>
                                </form>
                            )}
                        </>
                    )}

                    {status === 'error' && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
