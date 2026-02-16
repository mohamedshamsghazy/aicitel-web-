import ScrollReveal from '@/components/ScrollReveal';
import { useTranslations } from 'next-intl';

export default function Services() {
    const t = useTranslations('Services');

    const services = [
        {
            title: t('items.infrastructure.title'),
            description: t('items.infrastructure.description'),
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            )
        },
        {
            title: t('items.consulting.title'),
            description: t('items.consulting.description'),
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            )
        },
        {
            title: t('items.development.title'),
            description: t('items.development.description'),
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 px-4 bg-background">
            <div className="max-w-6xl mx-auto space-y-16">
                <ScrollReveal>
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight">
                            {t('hero.title')}
                            <span className="block text-primary mt-2">{t('hero.highlight')}</span>
                        </h2>
                        <p className="text-xl text-secondary">
                            {t('hero.subtitle')}
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <div
                                className="group p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 h-full"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-slate-900 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-secondary leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
