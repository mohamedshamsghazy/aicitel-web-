'use client';

import { useState } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer'; // Type import fix

import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';

export default function FAQAccordion({ items }: { items: any[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const t = useTranslations('EmptyStates.faq');

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500 text-2xl">
                    ?
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('title')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    {t('description')}
                </p>
                <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                    {t('cta')}
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                        >
                            <span className="font-semibold text-gray-900">{faq.question}</span>
                            <span className="shrink-0 ml-4">
                                {isOpen ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-slate-400" />}
                            </span>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="pb-6 text-slate-600 leading-relaxed text-sm md:text-base">
                                {/* Handle Rich Text or String */}
                                {typeof faq.answer === 'string' ? (
                                    faq.answer
                                ) : faq.answer ? (
                                    <BlocksRenderer content={faq.answer} />
                                ) : (
                                    <p className="text-gray-400 italic">{t('noAnswer')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
