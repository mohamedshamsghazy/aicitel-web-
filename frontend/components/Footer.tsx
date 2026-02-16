'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, MapPin, Phone, Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer');

    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/share/1WsS6CppX8/' },
        { icon: Instagram, href: 'https://www.instagram.com/aicitel_company/' }
    ];

    return (
        <footer className="bg-slate-50 border-t border-slate-200">
            {/* Pre-Footer CTA */}
            <div className="border-b border-slate-200 bg-white">
                <div className="container mx-auto px-6 py-20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl text-center md:text-left md:rtl:text-right">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                                {t('preFooter.headline')}
                            </h2>
                            <p className="text-lg text-slate-600 font-light">
                                {t('preFooter.subline')}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href="/contact"
                                className="group bg-primary hover:bg-primary-hover text-white px-8 py-4 text-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                                {t('preFooter.cta')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20 rtl:text-right">

                    {/* Column 1: Brand & Trust */}
                    <div className="flex flex-col gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
                            aicitel<span className="text-slate-400 font-light">.company</span>
                        </Link>

                        <p className="text-slate-500 text-sm leading-relaxed">
                            {t('logoSubtitle')}
                        </p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                {t('iso')}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                {t('gdpr')}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Solutions */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">{t('solutions')}</h3>
                        <ul className="flex flex-col gap-4 text-sm text-slate-600">
                            <li><Link href="/services" className="hover:text-primary transition-colors">{t('solutions')}</Link></li>
                            <li><Link href="/partner" className="hover:text-primary transition-colors">{t('partner')}</Link></li>
                            <li><Link href="/career" className="hover:text-primary transition-colors">{t('career')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">{t('company')}</h3>
                        <ul className="flex flex-col gap-4 text-sm text-slate-600">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link></li>
                            <li><Link href="/career" className="hover:text-primary transition-colors">{t('career')}</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">{t('contact')}</h3>
                        <ul className="flex flex-col gap-4 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                                <span>Rauchfußstraße 2b<br />06128 Halle (Saale)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                <a href="tel:+4934547009014" className="hover:text-primary">0345 4700 9014</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                <a href="mailto:info@aicitel.com" className="hover:text-primary">info@aicitel.com</a>
                            </li>
                        </ul>

                        <div className="flex gap-4 mt-2">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-100 text-slate-500 hover:bg-primary hover:text-white transition-all"
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Aicitel Company GmbH. {t('rights')}</p>
                    <div className="flex gap-6">
                        <Link href="/impressum" className="hover:text-primary transition-colors">{t('imprint')}</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">{t('privacy')}</Link>
                        <Link href="/cookie-policy" className="hover:text-primary transition-colors">{t('cookiePolicy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
