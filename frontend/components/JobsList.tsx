'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Job } from '@/lib/api';
import { MapPin, ArrowRight, Clock } from 'lucide-react';

interface Props {
    jobs: Job[];
}

export default function JobsList({ jobs }: Props) {
    const t = useTranslations('JobsList');

    if (!jobs || jobs.length === 0) {
        return (
            <section id="open-roles" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('title')}</h2>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto">{t('noJobs')}</p>
                    <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-100 max-w-lg mx-auto">
                        <h3 className="font-bold text-lg mb-2">{t('initiative.title')}</h3>
                        <p className="text-sm text-slate-500 mb-6">{t('initiative.text')}</p>
                        <a href="#application-form" className="inline-flex items-center text-primary font-bold hover:underline">
                            {t('initiative.cta')} <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="open-roles" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('title')}</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/career/${job.attributes.slug}`}
                            className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">
                                        {job.attributes.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {job.attributes.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {job.attributes.status === 'Open' ? t('fullTime') : job.attributes.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
