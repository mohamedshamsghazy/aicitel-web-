import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ScrollReveal';

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: 'url(/images/hero_bg.png)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
            </div>

            <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-white rtl:text-right">
                    <ScrollReveal>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 pb-2">
                                {t('headlineHighlight')}
                            </span>
                            {t('headline')}
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-100 max-w-xl font-light leading-relaxed rtl:mr-0 rtl:ml-auto">
                            {t('subline')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 rtl:justify-start">
                            <Link
                                href="/partner"
                                className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary-light transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 shadow-md"
                            >
                                {t('ctaProject')}
                            </Link>
                            <Link
                                href="/career"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg text-center hover:bg-white hover:text-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                {t('ctaJoin')}
                            </Link>
                        </div>
                    </ScrollReveal>

                    {/* Trust Badges */}
                    <ScrollReveal delay={0.2}>
                        <div className="pt-12 flex flex-wrap gap-6 items-center border-t border-white/20 mt-8 rtl:justify-start">
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div className="text-xs font-bold uppercase leading-tight text-white/90 rtl:text-right">{t('badgeTopCompany')}<br /><span className="text-blue-200">{t('badgeYear')}</span></div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <div className="text-xs font-bold uppercase leading-tight text-white/90 rtl:text-right">{t('badgeTrusted')}<br /><span className="text-blue-200">{t('badgePartner')}</span></div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <div className="text-xs font-bold uppercase leading-tight text-white/90 rtl:text-right">{t('badgeIndustry')}<br /><span className="text-blue-200">{t('badgeMember')}</span></div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block z-20">
                <Link href="/about" className="text-white/50 hover:text-white transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </Link>
            </div>

        </section>
    );
}
