import { useTranslations } from 'next-intl';

export default function EmployeeSuccess() {
    const t = useTranslations('EmployeeSuccess');

    return (
        <section className="py-24 px-4 bg-white">
            <div className="container mx-auto flex flex-col items-center text-center space-y-12">

                <div className="max-w-3xl space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        {t('headline')}
                        <div className="h-1 w-24 bg-primary mx-auto mt-6 rounded-full"></div>
                    </h2>

                    <p className="text-xl text-secondary leading-relaxed">
                        {t('text')}
                    </p>
                </div>

                <div className="w-full max-w-5xl">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-x-1 hover:skew-x-0 transition-transform duration-700">
                        <img
                            src="/images/employee_success.png"
                            alt="Successful Team"
                            className="object-cover w-full h-[500px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-6 left-6 text-white text-left rtl:left-auto rtl:right-6 rtl:text-right">
                            <p className="font-bold text-lg">{t('imageLabelTitle')}</p>
                            <p className="text-sm opacity-80">{t('imageLabelText')}</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
