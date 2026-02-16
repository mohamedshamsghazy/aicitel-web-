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
                    {/* Sector items removed per user request */}
                </div>
            </ScrollReveal>
        </section>
    );
}
