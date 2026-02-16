import { useTranslations } from 'next-intl';

export default function CareerBenefits() {
    const t = useTranslations('CareerBenefits');

    const benefits = ['salary', 'training', 'events', 'technology', 'remote', 'growth'];

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('title')}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit) => (
                        <div key={benefit} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">{t(`${benefit}.title`)}</h3>
                                <p className="text-sm text-gray-600">{t(`${benefit}.description`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
