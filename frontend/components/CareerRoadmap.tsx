import { useTranslations } from 'next-intl';

export default function CareerRoadmap() {
    const t = useTranslations('CareerRoadmap');

    const steps = ['trainee', 'agent', 'teamlead', 'manager'];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight">{t('title')}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={step} className={`relative flex items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                                <div className="w-5/12"></div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm z-10">
                                    {index + 1}
                                </div>
                                <div className={`w-5/12 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                    <h3 className="text-xl font-bold text-primary mb-2">{t(`${step}.title`)}</h3>
                                    <p className="text-sm text-gray-600">{t(`${step}.description`)}</p>
                                    <span className="inline-block mt-3 text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                                        {t(`${step}.duration`)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
