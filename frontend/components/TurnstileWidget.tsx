'use client';

import Turnstile from 'react-turnstile';
import { useEffect, useState } from 'react';

interface Props {
    onVerify: (token: string) => void;
    onError?: () => void;
}

export default function TurnstileWidget({ onVerify, onError }: Props) {
    const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000BB'; // Test Key (Invisible)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="my-4 min-h-[65px]">
            <Turnstile
                sitekey={SITE_KEY}
                onVerify={onVerify}
                onError={onError}
                theme="light"
            />
        </div>
    );
}
