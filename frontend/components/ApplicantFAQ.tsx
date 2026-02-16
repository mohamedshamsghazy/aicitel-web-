'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ApplicantFAQ() {
    const t = useTranslations('ApplicantFAQ');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [1, 2, 3, 4, 5];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">{t('title')}</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((i, index) => (
                        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-gray-900">{t(`q${i}`)}</span>
                                <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                className={`bg-gray-50 px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {t(`a${i}`)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
