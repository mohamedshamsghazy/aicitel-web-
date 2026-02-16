import { useTranslations } from 'next-intl';

export default function Methodology() {
    const t = useTranslations('Methodology');

    const steps = ['recruiting', 'training', 'deployment', 'optimization'];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('title')}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={step} className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center group hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-16 h-16 mx-auto bg-white border-4 border-primary/10 rounded-full flex items-center justify-center mb-6 text-xl font-bold text-primary group-hover:border-primary transition-colors">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{t(`${step}.title`)}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {t(`${step}.description`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
