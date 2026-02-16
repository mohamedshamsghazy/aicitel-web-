'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CookieConsent() {
    // const t = useTranslations('CookieConsent'); // Assuming we add keys later, for now hardcode or use simple text
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('aicitel_consent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('aicitel_consent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500">
            <div className="text-sm text-slate-600 max-w-2xl text-center sm:text-left">
                <span className="font-bold text-slate-900">Privacy Settings: </span>
                We use only essential cookies to ensure the website functions correctly.
                We do not track you without permission.
                Full details in our <a href="/privacy" className="underline text-primary">Privacy Policy</a>.
            </div>
            <div className="flex gap-3">
                <button
                    onClick={accept}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-md text-sm font-medium transition-colors"
                >
                    Essential Only
                </button>
                <button
                    onClick={accept}
                    className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                    Accept All
                </button>
            </div>
        </div>
    );
}
