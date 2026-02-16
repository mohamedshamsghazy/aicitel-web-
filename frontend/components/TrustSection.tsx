'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function TrustSection() {
    const t = useTranslations('TrustSection');

    // Placeholder logos - replace with real assets later
    const logos = [1, 2, 3, 4, 5];

    return (
        <section className="py-12 border-b border-gray-100 bg-white">
            <ScrollReveal>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="text-lg font-bold text-gray-400 group-hover:text-primary transition-colors">{t('sectors.energy')}</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                        <span className="text-lg font-bold text-gray-400 group-hover:text-primary transition-colors">{t('sectors.telecom')}</span>
                    </div>
                    <div className="flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <span className="text-lg font-bold text-gray-400 group-hover:text-primary transition-colors">{t('sectors.infrastructure')}</span>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}
