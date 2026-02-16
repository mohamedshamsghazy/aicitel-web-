export default function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://aicitel.com/#organization',
                name: 'Aicitel',
                url: 'https://aicitel.com',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://aicitel.com/logo.png',
                    width: 512,
                    height: 512
                },
                sameAs: [
                    'https://www.linkedin.com/company/aicitel',
                    'https://www.instagram.com/aicitel'
                ]
            },
            {
                '@type': 'LocalBusiness',
                '@id': 'https://aicitel.com/#localbusiness',
                name: 'Aicitel',
                image: 'https://aicitel.com/og-image.jpg',
                url: 'https://aicitel.com',
                telephone: '+4934547009014',
                email: 'info@aicitel.com',
                priceRange: '$$$',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Rauchfußstraße 2b',
                    addressLocality: 'Halle (Saale)',
                    postalCode: '06128',
                    addressCountry: 'DE'
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 51.4969,
                    longitude: 11.9688
                },
                openingHoursSpecification: [
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        opens: '09:00',
                        closes: '18:00'
                    }
                ],
                areaServed: {
                    '@type': 'GeoCircle',
                    geoMidpoint: {
                        '@type': 'GeoCoordinates',
                        latitude: 51.4969,
                        longitude: 11.9688
                    },
                    geoRadius: '500000'
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
