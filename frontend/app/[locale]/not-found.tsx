import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <main className="min-h-screen bg-white flex items-center justify-center py-24 px-6">
            <div className="text-center max-w-lg mx-auto">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-slate-100">404</h1>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-12">
                        <span className="text-primary text-xl font-bold tracking-widest uppercase bg-white px-4">
                            Oops!
                        </span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('title')}</h2>
                <p className="text-lg text-slate-600 mb-10">{t('description')}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover transition-colors"
                    >
                        {t('ctaHome')}
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-full hover:bg-slate-50 transition-colors"
                    >
                        {t('ctaHelp')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
