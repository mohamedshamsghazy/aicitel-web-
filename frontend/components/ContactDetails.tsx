import Link from 'next/link';

export default function ContactDetails() {
    const contactInfo = [
        {
            title: "Phone",
            value: "+49 123 456 789", // Placeholder
            href: "tel:+49123456789",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
            )
        },
        {
            title: "Email Address",
            value: "info@aicitel-company.com",
            href: "mailto:info@aicitel-company.com",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            )
        },
        {
            title: "Address",
            value: (
                <>
                    Aicitel Company<br />
                    Rauchfußstraße 2b<br />
                    06128 Halle
                </>
            ),
            href: "https://maps.google.com/?q=Rauchfußstraße+2b,+06128+Halle",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contactInfo.map((info, index) => (
                        <Link
                            key={index}
                            href={info.href}
                            className="flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                {info.icon}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                {info.title}
                            </h3>

                            <div className="text-lg text-primary font-medium group-hover:text-primary-hover transition-colors">
                                {info.value}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
