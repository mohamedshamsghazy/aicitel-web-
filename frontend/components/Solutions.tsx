import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Solutions() {
    const t = useTranslations('Solutions');

    const solutions = [
        {
            key: 'directSales',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            key: 'acquisition',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            key: 'optimization',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/images/backgrounds/pattern-light.png')] bg-repeat opacity-40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>

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
                    {solutions.map((item) => (
                        <div key={item.key} className="group p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-105"></div>

                            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-8 shadow-sm group-hover:scale-105 transition-transform duration-300 relative z-10">
                                {item.icon}
                            </div>

                            <h4 className="text-2xl font-bold text-primary mb-4 relative z-10">
                                {t(`${item.key}.title`)}
                            </h4>

                            <p className="text-slate-600 mb-8 leading-relaxed relative z-10">
                                {t(`${item.key}.description`)}
                            </p>

                            <Link
                                href="/services"
                                className="inline-flex items-center text-accent font-bold text-sm hover:text-primary transition-colors group/link relative z-10"
                            >
                                {t(`${item.key}.cta`)}
                                <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
