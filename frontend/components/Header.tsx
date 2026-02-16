import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const t = useTranslations('Navigation');

    return (
        <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
                    aicitel <span className="text-gray-400 font-light">company</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
                    <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('about')}
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('services')}
                    </Link>
                    <Link href="/career" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('career')}
                    </Link>
                    <Link href="/partner" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('partner')}
                    </Link>

                    <div className="ml-4 pl-4 border-l rtl:border-r rtl:border-l-0 rtl:ml-0 rtl:mr-4 border-gray-200">
                        <LanguageSwitcher />
                    </div>

                    <Link href="/contact" className="hidden lg:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light transition-colors shadow-sm">
                        {t('contact')}
                    </Link>
                </nav>

                {/* Mobile Menu Button (Placeholder) */}
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="text-gray-600 hover:text-primary">
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
