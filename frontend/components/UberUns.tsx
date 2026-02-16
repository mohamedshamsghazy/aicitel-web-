'use client';

import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';

// Simple Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);

            setCount(Math.floor(ease * end));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function UberUns() {
    const t = useTranslations('UberUns');

    return (
        <section id="uber-uns" className="py-24 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 mx-auto">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-sm font-bold text-primary tracking-widest uppercase">{t('subtitle')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                            {t('headline')}
                        </h2>

                        <p className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
                            {t.rich('text', {
                                bold: (chunks) => <span className="text-slate-900 font-semibold">{chunks}</span>
                            })}
                        </p>

                        <div className="pt-4 flex justify-center">
                            <Link
                                href="/contact"
                                className="inline-block px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/25"
                            >
                                {t('cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
