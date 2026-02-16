import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Legal' });

    return {
        title: t('privacyTitle'),
    };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Legal' });

    return (
        <main className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-3xl prose prose-slate">
                <div className="mb-6">
                    <Breadcrumbs items={[{ label: t('privacyHeading'), href: '/privacy' }]} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('privacyHeading')}</h1>

                <h2 className="text-xl font-bold mt-6 mb-4">{t('privacyGeneralTitle')}</h2>
                <p>{t('privacyGeneralText')}</p>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 my-8">
                    <p className="font-bold text-slate-900 mb-1">{t('privacyResponsibleLabel')}</p>
                    <p className="text-slate-600">
                        Aicitel Company GmbH<br />
                        Rauchfußstraße 2b<br />
                        06128 Halle (Saale)<br />
                        Deutschland<br />
                        Datenschutzbeauftragter: info@aicitel-company.com
                    </p>
                </div>

                <h2 className="text-xl font-bold mt-6 mb-4">{t('privacyRightsTitle')}</h2>
                <p>{t('privacyRightsIntro')}</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>{t('privacyRight1')}</li>
                    <li>{t('privacyRight2')}</li>
                    <li>{t('privacyRight3')}</li>
                    <li>{t('privacyRight4')}</li>
                    <li>{t('privacyRight5')}</li>
                    <li>{t('privacyRight6')}</li>
                </ul>
            </div>
        </main>
    );
}
