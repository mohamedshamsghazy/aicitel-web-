import { useTranslations } from 'next-intl';

export default function ComplianceSection() {
    const t = useTranslations('Compliance');

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">{t('title')}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {['dataProtection', 'ethics', 'transparency'].map((item) => (
                        <div key={item} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">{t(`${item}.title`)}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {t(`${item}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
