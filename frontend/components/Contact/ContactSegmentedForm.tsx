'use client';

import { useState } from 'react';
import { submitApplication, submitInquiry } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { ShieldCheck, Clock, FileText, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import TurnstileWidget from '@/components/TurnstileWidget';

export default function ContactSegmentedForm() {
    const [activeTab, setActiveTab] = useState<'business' | 'career'>('business');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    const t = useTranslations('ContactNew');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setMessage("Please complete the security check.");
            setStatus('error');
            return;
        }

        setStatus('loading');

        const formData = new FormData(e.currentTarget);

        try {
            if (activeTab === 'business') {
                const data = Object.fromEntries(formData.entries());
                data.token = token;
                await submitInquiry(data);
            } else {
                formData.append('type', 'Applicant');
                formData.append('token', token);
                await submitApplication(formData);
            }
            setStatus('success');
            router.push('/thank-you');
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <section className="bg-white py-0 -mt-8 relative z-10 mb-20">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">

                    {/* Left Column: Form */}
                    <div className="flex-1 p-8 md:p-12 lg:border-r border-slate-100">
                        {/* Custom Tabs */}
                        <div className="flex p-1 bg-slate-50 rounded-lg mb-10">
                            <button
                                onClick={() => setActiveTab('business')}
                                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${activeTab === 'business'
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {t('tabs.business')}
                            </button>
                            <button
                                onClick={() => setActiveTab('career')}
                                className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${activeTab === 'career'
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {t('tabs.career')}
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {activeTab === 'business' ? t('business.title') : t('career.title')}
                            </h2>
                            <p className="text-slate-500">
                                {activeTab === 'business' ? t('business.description') : t('career.description')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('form.name')}</label>
                                    <input required name="fullName" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('form.email')}</label>
                                    <input required name="email" type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('form.phone')}</label>
                                    <input required name="phone" type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{activeTab === 'business' ? t('form.company') : t('form.position')}</label>
                                    <input required name={activeTab === 'business' ? 'company' : 'position'} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                            </div>

                            {activeTab === 'career' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('form.cv')}</label>
                                    <input name="cv" type="file" accept=".pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('form.message')}</label>
                                <textarea name="message" rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"></textarea>
                            </div>

                            <TurnstileWidget onVerify={(token) => setToken(token)} />

                            <button
                                disabled={status === 'loading'}
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {activeTab === 'business' ? t('form.submitBusiness') : t('form.submitCareer')}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-slate-400">
                                {t('form.privacy')}
                            </p>
                        </form>
                    </div>

                    {/* Right Column: Trust Signals */}
                    <div className="lg:w-1/3 bg-slate-50 p-8 md:p-12 border-l border-slate-200 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-8">
                                {activeTab === 'business' ? 'Why Partner?' : 'Why Join?'}
                            </h3>

                            <div className="space-y-8">
                                {activeTab === 'business' ? (
                                    <>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <FileText className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('business.features.nda')}</h4>
                                                <p className="text-xs text-slate-500">Full confidentiality guaranteed.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('business.features.response')}</h4>
                                                <p className="text-xs text-slate-500">Priority support channel.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <ShieldCheck className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('business.features.custom')}</h4>
                                                <p className="text-xs text-slate-500">Tailored to your KPIs.</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('career.features.training')}</h4>
                                                <p className="text-xs text-slate-500">Full certification included.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('career.features.uncapped')}</h4>
                                                <p className="text-xs text-slate-500">Write your own paycheck.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('career.features.growth')}</h4>
                                                <p className="text-xs text-slate-500">Merit-based promotion.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Support</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                                <span className="font-bold text-slate-900">Email:</span> info@aicitel.com
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-bold text-slate-900">Phone:</span> 0345 4700 9014
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
