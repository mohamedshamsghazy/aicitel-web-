import { useTranslations } from 'next-intl';

export default function Mission() {
    const t = useTranslations('Mission');

    return (
        <section className="py-24 px-4 bg-white overflow-hidden">
            <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">

                <div className="lg:w-1/2 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase leading-none tracking-tight rtl:text-right">
                        {t('headline')} <br />
                        <span className="text-primary underline decoration-4 underline-offset-8 decoration-primary/20">{t('headlineHighlight')}</span>
                    </h2>

                    <div className="space-y-6 text-lg text-secondary leading-relaxed font-medium rtl:text-right">
                        <p className="border-l-4 border-primary pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
                            {t('text1')}
                        </p>
                        <p className="pl-4 rtl:pl-0 rtl:pr-4">
                            {t('text2')}
                        </p>
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-[500px]">
                        <img
                            src="/images/mission_meeting.png"
                            alt="Team Meeting"
                            className="object-cover w-full h-full transform transition-transform group-hover:scale-105 duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    </div>
                </div>

            </div>
        </section>
    );
}
