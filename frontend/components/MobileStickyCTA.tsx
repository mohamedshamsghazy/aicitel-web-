'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function MobileStickyCTA() {
    const t = useTranslations('StickyHeader'); // Reusing existing translations for now
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past hero (approx 600px)
            setIsVisible(window.scrollY > 600);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:hidden animate-fade-in-up">
            <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-slate-600">
                    {t('career')}?
                </div>
                <Link
                    href="/career"
                    className="flex-1 bg-primary text-white text-center py-3 rounded-full font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                    {t('applyNow')}
                </Link>
            </div>
        </div>
    );
}
