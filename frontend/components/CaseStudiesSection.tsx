'use client';

import { useTranslations } from 'next-intl';

export default function CaseStudiesSection() {
    const t = useTranslations('CaseStudies');

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-slate-600">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {['case1', 'case2', 'case3'].map((caseItem, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                                {t(`${caseItem}.tag`)}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                {t(`${caseItem}.title`)}
                            </h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-slate-900">
                                    {t(`${caseItem}.metric`)}
                                </span>
                            </div>
                            <p className="text-slate-600">
                                {t(`${caseItem}.desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
