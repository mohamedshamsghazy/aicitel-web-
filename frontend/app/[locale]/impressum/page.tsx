import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Legal' });

    return {
        title: t('impressumTitle'),
    };
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Legal' });

    return (
        <main className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-3xl prose prose-slate">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('impressumHeading')}</h1>

                <h2 className="text-xl font-semibold mb-2">{t('tmg')}</h2>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-8">
                    <p className="font-bold text-slate-900 mb-1">Aicitel Company GmbH</p>
                    <p className="text-slate-600">
                        Rauchfußstraße 2b<br />
                        06128 Halle (Saale)<br />
                        Deutschland
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-2">{t('representedBy')}</h3>
                        <p className="text-slate-600">Geschäftsleitung</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-2">{t('contact')}</h3>
                        <p className="text-slate-600">
                            Telefon: 0345 4700 9014<br />
                            E-Mail: info@aicitel.com
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8">
                    <h3 className="font-semibold text-slate-900 mb-2">Registereintrag:</h3>
                    <p className="text-slate-600 mb-4">
                        Eintragung im Handelsregister.<br />
                        Registergericht: Amtsgericht Halle (Saale)<br />
                        Registernummer: HRB [Nummer]
                    </p>

                    <h3 className="font-semibold text-slate-900 mb-2">Umsatzsteuer-ID:</h3>
                    <p className="text-slate-600">
                        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                        DE [Nummer]
                    </p>
                </div>
            </div>
        </main>
    );
}
