import { getTranslations } from 'next-intl/server';
import ContactHero from '@/components/Contact/ContactHero';
import ContactSegmentedForm from '@/components/Contact/ContactSegmentedForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ContactPage' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <ContactHero />
            <ContactSegmentedForm />
        </main>
    );
}
