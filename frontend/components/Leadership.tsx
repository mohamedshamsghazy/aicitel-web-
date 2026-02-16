import { useTranslations } from 'next-intl';

export default function Leadership() {
    const t = useTranslations('Leadership');

    const leaders = ['member1', 'member2', 'member3'];

    // Placeholder images for leadership
    const images = [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
    ];

    return (
        <section className="py-24 bg-white" id="team">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
                        {t('title')}
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                        {t('subtitle')}
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {leaders.map((key, index) => (
                        <div key={key} className="group relative">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-slate-100 relative">
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors z-10 duration-500"></div>
                                <img
                                    src={images[index]}
                                    alt={t(`${key}.name`)}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <h4 className="text-xl font-bold text-primary mb-1">
                                {t(`${key}.name`)}
                            </h4>
                            <p className="text-accent font-medium text-sm mb-3">
                                {t(`${key}.role`)}
                            </p>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {t(`${key}.bio`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
