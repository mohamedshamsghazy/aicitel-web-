import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import StickyHeader from '@/components/StickyHeader';
import Footer from '@/components/Footer';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import CookieConsent from '@/components/CookieConsent';
import FloatingLanguageSelector from '@/components/FloatingLanguageSelector';
import JsonLd from '@/components/JsonLd';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Index' });

    return {
        title: t('title'),
        description: t('metaDescription'),
        metadataBase: new URL('https://aicitel.com'),
        alternates: {
            canonical: `/${locale}`,
            languages: {
                en: '/en',
                de: '/de',
                ar: '/ar',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('metaDescription'),
            type: 'website',
            locale: locale,
            url: `/${locale}`,
            siteName: 'Aicitel',
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir} className="scroll-smooth">
            <body className={`${inter.variable} font-sans bg-white text-gray-900 antialiased`}>
                <JsonLd />
                <NextIntlClientProvider messages={messages}>
                    <StickyHeader />
                    <main className="pt-20">
                        {children}
                    </main>
                    <FloatingLanguageSelector />
                    <MobileStickyCTA />
                    <CookieConsent />
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
