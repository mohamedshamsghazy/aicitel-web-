import { fetchAPI } from './strapi';

export interface Job {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: any; // Block content
    location: string;
    highlight: boolean;
    featuredOrder: number;
    jobStatus: 'Open' | 'Closed' | 'Archived';
    closingDate: string | null;
    metaTitle?: string;
    metaDescription?: string;
    locale: string;
    updatedAt: string;
    localizations?: { data: Job[] };
}

export interface FAQ {
    id: number;
    documentId: string;
    question: string;
    answer: any;
    category: 'Career' | 'Partner';
    order: number;
}

export async function getJobs(locale: string) {
    try {
        const data = await fetchAPI('/jobs', {
            locale,
            filters: {
                jobStatus: { $eq: 'Open' },
            },
            populate: '*',
            sort: ['featuredOrder:asc', 'publishedAt:desc'],
        });
        return data.data as Job[];
    } catch (error) {
        console.warn(`[getJobs] Failed to fetch data for locale ${locale}:`, error);
        return [];
    }
}

export async function getHighlightedJobs(locale: string) {
    try {
        const data = await fetchAPI('/jobs', {
            locale,
            filters: {
                jobStatus: { $eq: 'Open' },
                highlight: { $eq: true },
            },
            populate: '*',
            sort: ['featuredOrder:asc'],
            pagination: {
                limit: 3
            }
        });
        return data.data as Job[];
    } catch (error) {
        console.warn(`[getHighlightedJobs] Failed to fetch data for locale ${locale}:`, error);
        return [];
    }
}

export async function getJobBySlug(slug: string, locale: string) {
    try {
        const data = await fetchAPI('/jobs', {
            locale,
            filters: {
                slug: { $eq: slug },
            },
            populate: '*',
        });

        if (!data?.data || data.data.length === 0) {
            return undefined;
        }

        return data.data[0] as Job;
    } catch (error) {
        console.warn(`[getJobBySlug] Failed to fetch job ${slug}:`, error);
        return undefined;
    }
}

export async function getFAQs(locale: string) {
    try {
        const data = await fetchAPI('/faqs', {
            locale,
            sort: ['order:asc'],
            populate: '*',
        });
        return data.data.map((item: any) => ({
            id: item.id,
            ...item.attributes
        })) as FAQ[];
    } catch (error) {
        console.warn(`[getFAQs] Failed to fetch FAQs for locale ${locale}:`, error);
        return [];
    }
}

export async function submitApplication(formData: FormData) {
    const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        // Throw specific error message if available
        throw new Error(data.error || 'Application failed');
    }

    return data;
}

export async function submitInquiry(data: any) {
    const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Inquiry failed');
    }

    return result;
}
