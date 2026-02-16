import { useTranslations } from 'next-intl';

export default function KurzErklaert() {
    const t = useTranslations('KurzErklaert');

    return (
        <section className="py-24 px-4 bg-white text-center">
            <div className="container mx-auto max-w-3xl space-y-8">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">{t('label')}</span>

                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                    {t('headline')} <br />
                    {t('headlineBreak')}
                    <div className="h-1 w-24 bg-primary mx-auto mt-6 rounded-full"></div>
                </h2>

                <p className="text-xl text-secondary leading-relaxed">
                    {t('text')}
                </p>
            </div>
        </section>
    );
}
