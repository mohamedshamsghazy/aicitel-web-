import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function ProductPartner() {
    const t = useTranslations('ProductPartner');

    return (
        <section id="partner" className="py-24 px-4 bg-slate-50 text-center">
            <div className="container mx-auto max-w-4xl space-y-8">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">{t('label')}</span>

                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                    {t('headline')}
                </h2>

                <p className="text-xl text-secondary leading-relaxed">
                    {t('text')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 rtl:text-right">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-2">{t('card1Title')}</h3>
                        <p className="text-slate-500">{t('card1Text')}</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-2">{t('card2Title')}</h3>
                        <p className="text-slate-500">{t('card2Text')}</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-2">{t('card3Title')}</h3>
                        <p className="text-slate-500">{t('card3Text')}</p>
                    </div>
                </div>

                <div className="pt-8">
                    <Link
                        href="/contact"
                        className="inline-block px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                        {t('cta')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
