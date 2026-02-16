import FAQ from '@/components/FAQ';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'FAQPage' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default function FAQPage() {
    return (
        <main className="pt-16">
            <FAQ />
        </main>
    );
}
