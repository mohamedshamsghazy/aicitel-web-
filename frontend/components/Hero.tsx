import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ScrollReveal';

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20 md:pt-24">
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/brain/8ced509d-e244-4093-bf8d-617689be9b66/hero_background_with_logo_1771377947871.png)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/70"></div>
            </div>

            <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-white rtl:text-right">
                    <ScrollReveal>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 pb-2">
                                {t('headlineHighlight')}
                            </span>
                            {t('headline')}
                        </h1>

                        <p className="text-base md:text-xl lg:text-2xl text-slate-100 max-w-xl font-light leading-relaxed rtl:mr-0 rtl:ml-auto">
                            {t('subline')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 rtl:justify-start">
                            <Link
                                href="/career"
                                className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary-light transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 shadow-md"
                            >
                                {t('ctaJoin')}
                            </Link>
                            <Link
                                href="/partner"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg text-center hover:bg-white hover:text-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                {t('ctaProject')}
                            </Link>
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
