'use client';

import { useTranslations } from 'next-intl';
import FAQAccordion from './FAQAccordion';

export default function FAQSection() {
    const t = useTranslations('FAQPage');

    // Create array of Q&A objects compatible with FAQAccordion (Strapi structure)
    const faqItems = [1, 2, 3, 4, 5].map((num) => ({
        id: num,
        question: t(`q${num}`),
        answer: t(`a${num}`),
    }));

    return (
        <section className="py-24 bg-white" id="faq">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        {t('title')}
                    </h2>
                </div>

                <FAQAccordion items={faqItems} />
            </div>
        </section>
    );
}
