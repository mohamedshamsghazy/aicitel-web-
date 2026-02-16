import { useTranslations } from 'next-intl';

export default function DasSindWir() {
    const t = useTranslations('DasSindWir');

    return (
        <section className="relative py-40 px-4 flex items-center justify-center text-center bg-slate-900 text-white overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/images/das_sind_wir_bg.png)' }}
            >
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight uppercase">
                    {t('headline')}
                    <div className="h-1.5 w-32 bg-primary mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                </h2>

                <p className="text-2xl md:text-5xl font-light text-white uppercase tracking-wider">
                    {t('subline')} <span className="text-primary font-bold">{t('sublineDynamic')}</span>
                </p>
            </div>
        </section>
    );
}
