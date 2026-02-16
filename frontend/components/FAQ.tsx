import { getFAQs, FAQ as FAQType } from '@/lib/api';
import { getLocale } from 'next-intl/server';
import FAQAccordion from './FAQAccordion';

export default async function FAQ() {
    const locale = await getLocale();
    let faqs: FAQType[] = [];

    try {
        faqs = await getFAQs(locale);
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
    }

    return (
        <section id="faq" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Häufig gestellte Fragen</h2>
                <FAQAccordion items={faqs || []} />
            </div>
        </section>
    );
}
