'use client';

import { useTranslations } from 'next-intl';
import ContactForms from './ContactForms';

export default function Contact() {
    const t = useTranslations('Contact');

    return (
        <section id="kontakt" className="py-24 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">{t('label')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{t('headline')}</h2>
                </div>

                <div className="mt-12">
                    <ContactForms />
                </div>
            </div>
        </section>
    );
}
