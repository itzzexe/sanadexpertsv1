import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const DocumentSEO = ({ pageKey }) => {
    const { t, i18n } = useTranslation();

    const title = t(`seo.${pageKey}.title`);
    const description = t(`seo.${pageKey}.description`);
    const keywords = t('seo.keywords');
    const lang = i18n.language;
    const canonicalUrl = window.location.href;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "SANADXPERTS | سند إكسبرتس",
        "image": window.location.origin + "/assets/images/sanadxperts (2).svg",
        "@id": window.location.origin,
        "url": window.location.origin,
        "telephone": "+9647800407407",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": lang === 'ar' ? "الاعظمية - ساحة الدلال - مقابل الف ليلة و ليلى - الطابق الرابع" : "Ad-Dallal Square - Opposite Alf Leila Wa Leila - 4th Floor",
            "addressLocality": lang === 'ar' ? "بغداد" : "Baghdad",
            "addressRegion": lang === 'ar' ? "الاعظمية" : "Al-Adhamiya",
            "addressCountry": "IQ"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 33.363653,
            "longitude": 44.358895
        },
        "description": description,
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Saturday",
                "Sunday"
            ],
            "opens": "09:00",
            "closes": "17:00"
        },
        "department": [
            {
                "@type": "Service",
                "name": t('services.financial.title')
            },
            {
                "@type": "Service",
                "name": t('services.technology.title')
            },
            {
                "@type": "Service",
                "name": t('services.consulting.title')
            }
        ]
    };

    return (
        <Helmet titleTemplate="%s | Sanad Experts">
            <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Language Meta Tags */}
            <link rel="alternate" href={canonicalUrl} hreflang="ar" />
            <link rel="alternate" href={canonicalUrl} hreflang="en" />
            <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="/favicon.svg" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content="/favicon.svg" />

            {/* Canonical Link */}
            <link rel="canonical" href={canonicalUrl} />
        </Helmet>
    );
};

export default DocumentSEO;
