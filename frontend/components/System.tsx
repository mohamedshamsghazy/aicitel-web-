import { useTranslations } from 'next-intl';

export default function System() {
    return (
        <section id="system" className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/images/backgrounds/pattern-light.png')] bg-repeat opacity-30 mix-blend-multiply"></div>
            <div className="container mx-auto px-6 text-center">
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                    Our Process
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-20 tracking-tight">Our System</h2>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-0 right-0 h-0.5 bg-gray-200 -z-0 w-[80%] mx-auto"></div>

                    {/* Step 1 */}
                    <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group z-10 border border-slate-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-primary font-bold text-3xl border-4 border-secondary-muted group-hover:border-accent transition-colors shadow-sm">1</div>
                        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Recruiting</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Auswahl der besten Talente durch strukturiertes Bewerbungsverfahren.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group z-10 border border-slate-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-primary font-bold text-3xl border-4 border-secondary-muted group-hover:border-accent transition-colors shadow-sm">2</div>
                        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Ausbildung</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Intensive Schulung in Produktwissen und Verkaufstechniken.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group z-10 border border-slate-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-primary font-bold text-3xl border-4 border-secondary-muted group-hover:border-accent transition-colors shadow-sm">3</div>
                        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Einsatz</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Professioneller Kundenkontakt und Beratung vor Ort.</p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group z-10 border border-slate-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-primary font-bold text-3xl border-4 border-secondary-muted group-hover:border-accent transition-colors shadow-sm">4</div>
                        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Optimierung</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Kontinuierliche Analyse und Verbesserung der Ergebnisse.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
