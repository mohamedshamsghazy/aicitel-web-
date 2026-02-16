import { useTranslations } from 'next-intl';

export default function MentoringDetails() {
    const t = useTranslations('MentoringDetails');

    return (
        <section className="py-24 px-4 bg-white overflow-hidden">
            <div className="container mx-auto space-y-24">

                {/* Block 1: Image Left, Text Right */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/mentoring_discussion.png"
                                alt="Mentoring Discussion"
                                className="object-cover w-full h-[400px]"
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/2 space-y-6 rtl:text-right">
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{t('block1Title')}</h3>
                        <p className="text-lg text-secondary leading-relaxed">
                            {t('block1Text')}
                        </p>
                    </div>
                </div>

                {/* Block 2: Text Left, Image Right */}
                <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-6 rtl:text-right">
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{t('block2Title')}</h3>
                        <p className="text-lg text-secondary leading-relaxed">
                            {t('block2Text')}
                        </p>
                    </div>
                    <div className="lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/mentoring_focus.png"
                                alt="Training Session"
                                className="object-cover w-full h-[400px]"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
