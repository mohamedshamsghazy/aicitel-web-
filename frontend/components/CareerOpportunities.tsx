import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function CareerOpportunities() {
    const t = useTranslations('CareerOpportunities');

    const benefits = [
        t('benefit1'),
        t('benefit2'),
        t('benefit3'),
        t('benefit4')
    ];

    return (
        <section id="karriere" className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
            {/* Decorative bg elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none rtl:right-auto rtl:left-0"></div>

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8 rtl:text-right">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">{t('label')}</span>

                    <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        {t('headline')} <span className="text-white">{t('headlineHighlight')}</span>
                    </h2>

                    <p className="text-xl text-slate-300">
                        {t('subline')}
                    </p>

                    <Link
                        href="/contact"
                        className="inline-block px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/25 mt-4"
                    >
                        {t('cta')}
                    </Link>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-3xl">
                    <ul className="space-y-6">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-4 rtl:flex-row-reverse rtl:text-right">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                                    <svg className="w-5 h-5 text-white transform rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-xl font-medium text-slate-100">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
