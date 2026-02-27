import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ScrollReveal';

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20 md:pt-24">
            {/* Premium Gradient Background with AI Elements */}
            <div className="absolute inset-0 w-full h-full">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-card to-background-dark"></div>
                
                {/* Animated glow orbs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary-glow rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-glow rounded-full filter blur-3xl opacity-15 animate-pulse"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-text-primary rtl:text-right">
                    <ScrollReveal>
                        <div className="inline-block">
                            <div className="glass px-4 py-2 rounded-full mb-4 text-primary text-sm font-semibold tracking-wide">
                                ✨ AI-Driven Excellence
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
                            <span className="block glow-text pb-2">
                                {t('headlineHighlight')}
                            </span>
                            <span className="text-text-primary">
                                {t('headline')}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-2xl font-light leading-relaxed rtl:mr-0 rtl:ml-auto">
                            {t('subline')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8 rtl:justify-start">
                            <Link
                                href="/career"
                                className="group px-8 py-4 bg-primary text-background-dark text-lg font-bold rounded-lg hover:rounded-xl transition-all transform hover:-translate-y-1 shadow-glow hover:shadow-glow-lg hover:scale-105 duration-300"
                            >
                                {t('ctaJoin')}
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link
                                href="/partner"
                                className="group px-8 py-4 glass rounded-lg font-bold text-lg text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-accent border border-border-light"
                            >
                                {t('ctaProject')}
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">↗</span>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right side - AI visualization placeholder */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="relative w-96 h-96">
                        {/* Animated rings */}
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '8s' }}></div>
                        <div className="absolute inset-8 rounded-full border border-accent/20 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                        <div className="absolute inset-16 rounded-full border border-primary/10 animate-pulse"></div>
                        
                        {/* Center core */}
                        <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-xl animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/30 blur-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block z-20">
                <Link href="/about" className="text-primary/50 hover:text-primary transition-colors p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </Link>
            </div>

        </section>
    );
}
