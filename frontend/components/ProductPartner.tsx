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

                {t('text') && (
                    <p className="text-xl text-secondary leading-relaxed">
                        {t('text')}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 rtl:text-right">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-3 text-slate-900">{t(`card${i}Title`)}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">{t(`card${i}Text`)}</p>
                        </div>
                    ))}
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
