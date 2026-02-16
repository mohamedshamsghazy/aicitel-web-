import { useTranslations } from 'next-intl';

export default function About() {
    const t = useTranslations('About');

    return (
        <section className="relative py-32 px-4 flex items-center justify-center text-center bg-slate-900 text-white overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
                style={{ backgroundImage: 'url(/images/about_bg.png)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/80"></div>

            <div className="relative z-10 max-w-4xl space-y-6">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
                    {t('headline')}
                    <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
                </h2>

                <p className="text-2xl md:text-4xl font-light text-slate-300 tracking-wide uppercase">
                    {t('subheadline')}
                </p>
            </div>
        </section>
    );
}
