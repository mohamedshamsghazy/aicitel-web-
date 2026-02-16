import About from '@/components/About';
import KPISection from '@/components/KPISection';
import Testimonials from '@/components/Testimonials';
import Locations from '@/components/Locations';
import CareerBenefits from '@/components/CareerBenefits';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'AboutPage' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default function AboutPage() {
    return (
        <main>
            <About />
            <KPISection />
            <CareerBenefits />
            <Testimonials />
            <Locations />
        </main>
    );
}
