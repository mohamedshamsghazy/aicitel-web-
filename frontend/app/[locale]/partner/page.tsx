import Partner from '@/components/Partner';
import ContactForms from '@/components/ContactForms';
import ComplianceSection from '@/components/ComplianceSection';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'PartnerPage' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default function PartnerPage() {
    const t = useTranslations('PageTitles');

    return (
        <main>
            <Partner />
            <ComplianceSection />
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-primary mb-12">{t('partner')}</h2>
                    <ContactForms />
                </div>
            </section>
        </main>
    );
}
