'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

const locales = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
];

export default function FloatingLanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLocale = pathname.split('/')[1] || 'en'; // Simple extraction, routing handles it better usually but valid for now

    const switchLocale = (locale: string) => {
        router.replace(pathname, { locale });
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8" ref={containerRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full right-0 mb-4 min-w-[160px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <div className="p-2 space-y-1">
                            {locales.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => switchLocale(lang.code)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname.startsWith(`/${lang.code}`)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <span>{lang.label}</span>
                                    {pathname.startsWith(`/${lang.code}`) && (
                                        <Check className="w-4 h-4 ml-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 transition-colors ${isOpen ? 'bg-primary text-white shadow-primary/30' : 'bg-white/80 text-slate-700 hover:bg-white'
                    }`}
            >
                <Globe className="w-6 h-6" />
            </motion.button>
        </div>
    );
}
