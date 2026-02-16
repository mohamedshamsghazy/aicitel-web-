import { MetadataRoute } from 'next';

const baseUrl = 'https://aicitel.com';
const locales = ['en', 'de', 'ar'];
const routes = [
    '',
    '/about',
    '/career',
    '/services',
    '/contact',
    '/partner',
    '/privacy',
    '/impressum'
];

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemap: MetadataRoute.Sitemap = [];

    routes.forEach((route) => {
        locales.forEach((locale) => {
            sitemap.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    return sitemap;
}
