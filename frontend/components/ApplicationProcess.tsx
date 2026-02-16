import { useTranslations } from 'next-intl';

export default function ApplicationProcess() {
    const t = useTranslations('ApplicationProcess');

    const steps = ['online', 'interview', 'day', 'offer'];

    return (
        <section className="py-24 bg-primary text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
                    <p className="text-white/80 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={step} className="text-center relative">
                            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6 text-2xl font-bold border border-white/20">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t(`${step}.title`)}</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                {t(`${step}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
