'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function MobileStickyCTA() {
    const t = useTranslations('Hero'); // Reusing Hero CTA translations
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/90 backdrop-blur-md border-t border-gray-200 md:hidden pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                >
                    <div className="flex gap-3 max-w-md mx-auto">
                        <Link
                            href="/career"
                            className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-full text-center text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            {t('ctaJoin')}
                        </Link>
                        <Link
                            href="/contact"
                            className="flex-1 bg-white border border-gray-200 text-slate-900 font-bold py-3 px-4 rounded-full text-center text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('ctaProject')}
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
