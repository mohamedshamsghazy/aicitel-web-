import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function ThankYouPage() {
    const t = useTranslations('ContactForms');

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    {/* Hardcoded fallback if translation missing, ideally use t('thankYouTitle') */}
                    Message Received
                </h1>

                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Thank you for reaching out to Aicitel. Our team has received your submission and will process it shortly. You should receive a confirmation email within 24 hours.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-light transition-all shadow-md hover:shadow-lg"
                >
                    Return to Home
                </Link>
            </div>
        </main>
    );
}
