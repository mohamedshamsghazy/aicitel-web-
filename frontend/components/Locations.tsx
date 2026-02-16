import { useTranslations } from 'next-intl';

export default function Locations() {
    const t = useTranslations('Locations');

    return (
        <section className="py-32 bg-secondary-muted relative">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 tracking-tight">{t('title')}</h2>

                <div className="flex flex-wrap justify-center gap-8">
                    <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-sm w-full border-t-4 border-accent transition-all duration-300 hover:-translate-y-1">
                        <div className="mb-6 flex items-center justify-center w-12 h-12 bg-primary/5 rounded-full mx-auto text-primary">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13 21.014l-4.657-4.357a8.38 8.38 0 00-3.295-4.672C4.167 11.237 4 9.944 4 8.761a8.37 8.37 0 011.666-4.992L17.657 16.657z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">{t('headquarters.city')}</h3>
                        <p className="text-accent font-medium text-sm mb-6 uppercase tracking-wider">
                            {t('headquarters.type')}
                        </p>
                        <div className="space-y-3 text-slate-600">
                            <p className="font-medium">{t('headquarters.street')}</p>
                            <p>{t('headquarters.zip')}</p>
                            <p className="text-slate-400">{t('headquarters.country')}</p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <a href="https://www.google.com/maps/search/?api=1&query=Rauchfußstraße+2b,+06128+Halle+(Saale)" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:text-accent transition-colors text-sm flex items-center justify-center gap-2">
                                <span>Get Directions</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Placeholder for future location - blurred/disabled look */}
                    <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 max-w-sm w-full flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-primary shadow-sm relative z-10">
                            <span className="text-2xl font-bold">2026</span>
                        </div>
                        <p className="text-primary font-bold relative z-10">Planned Expansion</p>
                        <p className="text-slate-500 text-sm mt-2 relative z-10">Munich • Hamburg • Cologne</p>
                    </div>
                </div>

                <p className="mt-16 text-slate-400 text-sm font-medium tracking-wide border-b border-primary/10 inline-block pb-1">
                    {t('expansionNote')}
                </p>
            </div>
        </section>
    );
}
