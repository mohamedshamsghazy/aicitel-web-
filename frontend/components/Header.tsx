import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const t = useTranslations('Navigation');

    return (
        <header className="fixed w-full top-0 z-50 glass-dark transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                    <span className="glow-text">aicitel</span>
                    <span className="text-text-secondary font-light">AI</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
                    <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300">
                        {t('about')}
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300">
                        {t('services')}
                    </Link>
                    <Link href="/career" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300">
                        {t('career')}
                    </Link>
                    <Link href="/partner" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300">
                        {t('partner')}
                    </Link>

                    <div className="ml-4 pl-4 border-l rtl:border-r rtl:border-l-0 rtl:ml-0 rtl:mr-4 border-border-light">
                        <LanguageSwitcher />
                    </div>

                    <Link href="/contact" className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg text-background-dark bg-primary hover:bg-primary-hover transition-all duration-300 shadow-glow hover:shadow-glow-lg">
                        {t('contact')}
                    </Link>
                </nav>

                {/* Mobile Menu Button (Placeholder) */}
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="text-text-secondary hover:text-primary transition-colors">
                        <span className="sr-only">Open menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
