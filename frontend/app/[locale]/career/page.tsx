import Career from '@/components/Career';
import CareerBenefits from '@/components/CareerBenefits';
import CareerRoadmap from '@/components/CareerRoadmap';
import ApplicationProcess from '@/components/ApplicationProcess';

import ContactForms from '@/components/ContactForms';
import JobsList from '@/components/JobsList';
import { getJobs } from '@/lib/api';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'CareerPage' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function CareerPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const jobs = await getJobs(locale);

    return (
        <main>
            <Career />

            <JobsList jobs={jobs} />

            <div id="application-form" className="py-24 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Start Your Journey</h2>
                        <p className="text-slate-600">Apply for a specific role or send an unsolicited application.</p>
                    </div>
                    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
                        <ContactForms defaultTab="applicants" />
                    </div>
                </div>
            </div>

            <CareerBenefits />
            <CareerRoadmap />
            <ApplicationProcess />

        </main>
    );
}
