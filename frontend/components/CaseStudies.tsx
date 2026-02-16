import { useTranslations } from 'next-intl';

export default function CaseStudies() {
    const t = useTranslations('CaseStudies');

    const cases = ['case1'];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
                        {t('title')}
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                        {t('subtitle')}
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cases.map((key) => (
                        <div key={key} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
                            <div className="h-4 bg-primary group-hover:bg-accent transition-colors"></div>
                            <div className="p-8">
                                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                                    {t(`${key}.tag`)}
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                                    {t(`${key}.title`)}
                                </h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                                        {t(`${key}.metric`)}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium border-t border-slate-100 pt-4">
                                    {t(`${key}.desc`)}
                                </p>

                                <div className="mt-8 flex items-center text-sm font-bold text-primary cursor-pointer group/link">
                                    <span>PDF Case Study</span>
                                    <svg className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
