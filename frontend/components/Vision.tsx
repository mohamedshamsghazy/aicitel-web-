import { useTranslations } from 'next-intl';

export default function Vision() {
    const t = useTranslations('Vision');

    return (
        <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">

                <div className="lg:w-1/2 relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                        src="/images/vision_discussion.png"
                        alt="Visionary Discussion"
                        className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white rtl:left-auto rtl:right-8 rtl:text-right">
                        <p className="text-xs font-bold uppercase tracking-widest bg-primary px-3 py-1 inline-block mb-3 rounded-sm">{t('label')}</p>
                        <p className="text-xl font-medium tracking-wide">{t('sublabel')}</p>
                    </div>
                </div>

                <div className="lg:w-1/2 space-y-8 rtl:text-right">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight uppercase">
                        {t('headline')} <br />
                        <span className="text-primary relative inline-block">
                            {t('headlineHighlight')}
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 rtl:right-0 rtl:left-auto" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h2>

                    <div className="space-y-6 text-lg text-secondary leading-relaxed border-l-4 border-slate-200 pl-6 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-6">
                        <p>
                            {t('text1')}
                        </p>
                        <p>
                            {t('text2')}
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
