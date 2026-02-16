import System from '@/components/System';
import DataSales from '@/components/DataSales';
import Methodology from '@/components/Methodology';
import ComplianceSection from '@/components/ComplianceSection';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ServicesPage' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default function ServicesPage() {
    const t = useTranslations('PageTitles');

    return (
        <main>
            <div className="pt-16 pb-8 text-center bg-gray-50">
                <h1 className="text-4xl font-bold text-primary">{t('services')}</h1>
            </div>
            <System />
            <Methodology />
            <ComplianceSection />
            <DataSales />
        </main>
    );
}
