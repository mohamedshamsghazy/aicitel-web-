import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function BenefitsHighlight() {
    const t = useTranslations('BenefitsHighlight');

    const benefits = [
        {
            title: t('card1Title'),
            text: t('card1Text'),
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            )
        },
        {
            title: t('card2Title'),
            text: t('card2Text'),
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        },
        {
            title: t('card3Title'),
            text: t('card3Text'),
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            )
        },
        {
            title: t('card4Title'),
            text: t('card4Text'),
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        }
    ];

    return (
        <section className="py-24 px-4 bg-white">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 rtl:text-right">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 rtl:ml-auto rtl:mr-0 rtl:ml-0">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">{benefit.text}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-12">
                    <Link
                        href="/career"
                        className="inline-block px-12 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-primary/25"
                    >
                        {t('cta')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
