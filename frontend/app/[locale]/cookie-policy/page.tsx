import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'CookiePolicy' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'CookiePolicy' });

    return (
        <main className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">{t('title')}</h1>

                    <div className="prose prose-slate max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('whatAreCookies.title')}</h2>
                            <p className="text-slate-600 mb-4">{t('whatAreCookies.text')}</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('howWeUse.title')}</h2>
                            <p className="text-slate-600 mb-4">{t('howWeUse.text')}</p>
                            <ul className="list-disc pl-5 text-slate-600 space-y-2">
                                <li>{t('howWeUse.essential')}</li>
                                <li>{t('howWeUse.analytics')}</li>
                                <li>{t('howWeUse.marketing')}</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('managing.title')}</h2>
                            <p className="text-slate-600 mb-4">{t('managing.text')}</p>
                        </section>

                        <section className="pt-8 border-t border-slate-100">
                            <p className="text-sm text-slate-500">
                                {t('lastUpdated')}: February 2026
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
