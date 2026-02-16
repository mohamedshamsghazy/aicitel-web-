'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Testimonials() {
    const t = useTranslations('Testimonials');
    const [activeTab, setActiveTab] = useState<'employees' | 'partners'>('employees');

    return (
        <section className="py-24 bg-slate-900 overflow-hidden relative">
            {/* Background pattern */}
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('/images/backgrounds/abstract-flow.png')] bg-cover bg-center opacity-20 mix-blend-soft-light grayscale"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">{t('title')}</h2>

                    <div className="inline-flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                        <button
                            onClick={() => setActiveTab('employees')}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'employees'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {t('employees.tab')}
                        </button>
                        <button
                            onClick={() => setActiveTab('partners')}
                            className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'partners'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {t('partners.tab')}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-800 p-10 rounded-2xl relative group border border-slate-700 hover:border-primary/50 transition-colors">
                            <div className="absolute top-8 right-8 text-primary/20 text-8xl font-serif leading-none select-none group-hover:text-primary/40 transition-colors">
                                &ldquo;
                            </div>
                            <p className="text-slate-300 mb-8 relative z-10 text-lg leading-relaxed">
                                {t(`${activeTab}.item${i}.quote`)}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex-shrink-0 border border-slate-600"></div>
                                <div>
                                    <h4 className="font-bold text-white">{t(`${activeTab}.item${i}.name`)}</h4>
                                    <p className="text-xs text-primary font-bold uppercase tracking-wide">
                                        {t(`${activeTab}.item${i}.role`)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
