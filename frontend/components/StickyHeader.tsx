'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/navigation';
import { usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyHeader() {
    const t = useTranslations('StickyHeader');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('about'), href: '/about' },
        { name: t('career'), href: '/career' },
        { name: t('partner'), href: '/partner' },
        { name: t('contact'), href: '/contact' },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed w-full top-0 z-40 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo & Trust Signal */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
                        aicitel <span className="text-gray-400 font-light">company</span>
                    </Link>

                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:underline hover:decoration-2 hover:underline-offset-4 decoration-primary ${isScrolled || pathname !== '/' ? 'text-slate-700 hover:text-primary' : 'text-slate-700 hover:text-primary lg:text-slate-700'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full shadow-md shadow-primary/10 hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
                    >
                        {t('projectRequest')}
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-slate-700 z-50 relative"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className="space-y-1.5">
                        <motion.span
                            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
                            className="block w-6 h-0.5 bg-current"
                        ></motion.span>
                        <motion.span
                            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                            className="block w-6 h-0.5 bg-current"
                        ></motion.span>
                        <motion.span
                            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
                            className="block w-6 h-0.5 bg-current"
                        ></motion.span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl lg:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block text-lg font-medium text-slate-800 py-3 border-b border-slate-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <Link
                                href="/career"
                                className="w-full block text-center px-5 py-4 bg-primary text-white font-bold rounded-xl mt-4"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t('applyNow')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
