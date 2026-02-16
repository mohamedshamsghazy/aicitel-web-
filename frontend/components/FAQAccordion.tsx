'use client';

import { useState } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer'; // Type import fix

import { useTranslations } from 'next-intl';

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
            {items.map((faq, index) => (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                    >
                        <span className="font-semibold text-gray-900">{faq.attributes.question}</span>
                        <span className="text-primary text-xl font-bold">{openIndex === index ? '−' : '+'}</span>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
                    >
                        <div className="px-6 pb-4 text-gray-600 text-sm">
                            {/* Handle Rich Text or String */}
                            {typeof faq.attributes.answer === 'string' ? (
                                faq.attributes.answer
                            ) : (
                                <BlocksRenderer content={faq.attributes.answer} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
