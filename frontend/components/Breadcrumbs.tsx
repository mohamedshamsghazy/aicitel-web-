'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Breadcrumbs({
    items,
    theme = 'dark'
}: {
    items?: { label: string; href: string }[];
    theme?: 'light' | 'dark';
}) {
    // Colors based on theme
    const textBase = theme === 'light' ? 'text-white/80' : 'text-gray-500';
    const textHover = theme === 'light' ? 'hover:text-white' : 'hover:text-primary';
    const textActive = theme === 'light' ? 'text-white' : 'text-gray-700';
    const iconColor = theme === 'light' ? 'text-white/60' : 'text-gray-400';

    if (!items) return null;

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link href="/" className={`inline-flex items-center text-sm font-medium ${textBase} ${textHover}`}>
                        <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <svg className={`w-3 h-3 mx-1 ${iconColor}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                            {index === items.length - 1 ? (
                                <span className={`ml-1 text-sm font-medium md:ml-2 truncate max-w-[150px] md:max-w-none ${textActive}`}>{item.label}</span>
                            ) : (
                                <Link href={item.href} className={`ml-1 text-sm font-medium md:ml-2 ${textBase} ${textHover}`}>
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
