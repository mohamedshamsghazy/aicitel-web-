import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Partner() {
    const t = useTranslations('PartnerSection');

    return (
        <section id="partner" className="py-24 bg-primary relative overflow-hidden">
            {/* Background elements */}
            {/* Background elements */}
            <div className="absolute inset-0 opacity-10 bg-[url('/images/backgrounds/world-map.png')] bg-cover bg-center font-sans"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90 mix-blend-multiply"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 skew-x-12 translate-x-20 blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2 order-2 md:order-1">
                        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
                            Partnership
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('title')}</h2>
                        <p className="text-lg text-slate-300 mb-6 leading-relaxed font-light">
                            {t('description1')}
                        </p>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed font-light">
                            {t('description2')}
                        </p>
                        <Link
                            href="/contact?type=partner"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-accent hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/25 hover:-translate-y-1"
                        >
                            {t('cta')}
                        </Link>
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                        <div className="relative h-[500px] w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10"></div>
                            {/* Placeholder for Partner Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80")' }}
                            />
                            <div className="absolute bottom-8 left-8 z-20">
                                <p className="text-white font-bold text-xl">Grow together.</p>
                                <p className="text-slate-300 text-sm">Join our network of market leaders.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
