import Link from 'next/link';

export default function Career() {
    return (
        <section className="relative py-32 px-4 flex items-center justify-center text-center bg-slate-900 text-white overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/images/career_bg.png)' }}
            >
                <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 max-w-3xl space-y-8">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight drop-shadow-xl">
                    Start Your Career
                </h2>

                <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-xl mx-auto">
                    Join a team that celebrates ambition, energy, and success.
                </p>

                <div className="pt-8">
                    <Link
                        href="#open-roles"
                        className="inline-block px-12 py-5 bg-white text-primary rounded-full font-bold text-lg uppercase tracking-wide hover:bg-slate-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
