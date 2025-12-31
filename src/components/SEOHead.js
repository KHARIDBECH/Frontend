import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_SEO, BASE_URL } from '../utils/seo';

/**
 * SEOHead Component
 * Manages dynamic SEO meta tags for each page
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website, product, etc.)
 * @param {Object} props.schema - JSON-LD structured data
 */
const SEOHead = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    schema,
    noIndex = false,
}) => {
    const pageTitle = title
        ? `${title} | ${DEFAULT_SEO.siteName}`
        : DEFAULT_SEO.title;

    const pageDescription = description || DEFAULT_SEO.description;
    const pageKeywords = keywords || DEFAULT_SEO.keywords;
    const pageImage = image || DEFAULT_SEO.image;
    const pageUrl = url || BASE_URL;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />

            {/* Robots */}
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
            <meta property="og:locale" content={DEFAULT_SEO.locale} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />
            <meta name="twitter:site" content={DEFAULT_SEO.twitterHandle} />

            {/* Structured Data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
