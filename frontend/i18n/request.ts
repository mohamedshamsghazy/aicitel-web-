import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !['de', 'en', 'ar'].includes(locale)) {
        locale = 'de';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
