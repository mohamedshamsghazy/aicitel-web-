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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="space-y-8 text-left rtl:text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-sm font-bold text-primary tracking-widest uppercase">{t('subtitle')}</span>
                        </div>         <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                            {t('headline')}
                        </h2>

                        <p className="text-xl text-secondary leading-relaxed">
                            {t.rich('text', {
                                bold: (chunks) => <span className="text-slate-900 font-semibold">{chunks}</span>
                            })}
                        </p>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center md:text-left rtl:text-right">
                                <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                                    Experts
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide">{t('statEmployees')}</div>
                            </div>
                            <div className="text-center md:text-left rtl:text-right">
                                <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                                    Germany
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide">{t('statLocations')}</div>
                            </div>
                            <div className="text-center md:text-left rtl:text-right">
                                <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                                    Scalable
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wide">{t('statCustomers')}</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link
                                href="/contact"
                                className="inline-block px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/25"
                            >
                                {t('cta')}
                            </Link>
                        </div>
                    </div>

                    {/* Image Grid - Right Side */}
                    <div className="relative order-1 md:order-2 h-[400px] md:h-[600px] w-full">
                        {/* Main Image */}
                        <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl z-10">
                            <Image
                                src="/images/team-photo-final.png" // Ensure this image is in public/images
                                alt="Aicitel Team"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>        <div className="absolute bottom-8 left-8 z-20 text-white rtl:right-8 rtl:left-auto">
                            <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{t('imageLeadershipLabel')}</div>
                            <div className="text-2xl font-bold">{t('imageLeadershipHeadline')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
