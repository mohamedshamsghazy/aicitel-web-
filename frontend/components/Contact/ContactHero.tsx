'use client';

import { useTranslations } from 'next-intl';

export default function ContactHero() {
    const t = useTranslations('ContactNew.hero');

    return (
        <section className="bg-slate-50 pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    {t('badge')}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
                    {t('subtitle')}
                </p>
            </div>
        </section>
    );
}
