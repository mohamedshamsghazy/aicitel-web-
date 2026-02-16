import qs from 'qs';

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (process.env.STRAPI_API_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
        }

        const mergedOptions = {
            headers,
            ...options,
        };

        // Build request URL using qs for nested objects (filters, populate, etc.)
        const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
        const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (!contentType || contentType.indexOf("application/json") === -1) {
            // If we get an error page (HTML) or text
            const text = await response.text();
            console.error(`Non-JSON response from ${requestUrl}:`, text.substring(0, 100));
            throw new Error(`Invalid response from Strapi: ${response.status}`);
        }

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            throw new Error(`Failed to fetch API from ${requestUrl}`);
        }

        return data;
    } catch (error) {
        console.error('Fetch API Error:', error);
        // Do NOT re-throw if we want specific components to not crash. 
        // But throwing allows the component to handle 'error' state or ErrorBoundary.
        // For 'fetch failed' (ECONNREFUSED), it's better to re-throw and handle in component
        // OR return generic empty structure if we want to be very resilient (but silent failure).
        // Let's re-throw but formatted consistently.
        throw error;
    }
}

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend the Strapi URL
    return `${STRAPI_URL}${url}`;
}
