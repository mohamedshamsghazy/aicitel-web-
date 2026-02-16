import { useTranslations } from 'next-intl';
import ScrollReveal from '@/components/ScrollReveal';

export default function WhyChooseUs() {
    const t = useTranslations('WhyChooseUs');

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <ScrollReveal>
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
                            Why Aicitel
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">{t('title')}</h2>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
                            {t('subtitle')}
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Quality */}
                    <ScrollReveal delay={0.1}>
                        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500 group hover:-translate-y-1 h-full">
                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 text-3xl font-bold shadow-sm group-hover:scale-105 transition-transform duration-500">
                                ★
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{t('quality.title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('quality.description')}
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Speed */}
                    <ScrollReveal delay={0.2}>
                        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500 group hover:-translate-y-1 h-full">
                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 text-3xl font-bold shadow-sm group-hover:scale-105 transition-transform duration-500">
                                ⚡
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{t('speed.title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('speed.description')}
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Transparency */}
                    <ScrollReveal delay={0.3}>
                        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500 group hover:-translate-y-1 h-full">
                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 text-3xl font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                                👁
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{t('transparency.title')}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t('transparency.description')}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
