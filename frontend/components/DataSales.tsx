import { useTranslations } from 'next-intl';

export default function DataSales() {
    const t = useTranslations('DataSales');

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">{t('title')}</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                    {t('description')}
                </p>
            </div>
        </section>
    );
}

