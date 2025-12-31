/**
 * SEO Utilities for Kharid Bech
 * Provides helper functions for generating SEO-friendly content
 */

// Base URL for the website
export const BASE_URL = 'https://kharidbech.vercel.app';

// Default SEO configuration
export const DEFAULT_SEO = {
    siteName: 'Kharid Bech',
    title: 'Kharid Bech - Buy & Sell Used Products | Best Deals on Pre-Owned Items',
    description: "India's trusted marketplace for buying and selling used products. Find amazing deals on second-hand cars, bikes, mobiles, electronics, furniture & more.",
    keywords: 'buy sell used products, second hand items, pre-owned, classifieds, local marketplace',
    image: `${BASE_URL}/og-image.png`,
    twitterHandle: '@kharidbech',
    locale: 'en_IN',
};

/**
 * Generates page-specific SEO data
 * @param {Object} options - SEO options
 * @returns {Object} Complete SEO configuration
 */
export const generateSEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
}) => {
    return {
        title: title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title,
        description: description || DEFAULT_SEO.description,
        keywords: keywords || DEFAULT_SEO.keywords,
        openGraph: {
            title: title || DEFAULT_SEO.title,
            description: description || DEFAULT_SEO.description,
            image: image || DEFAULT_SEO.image,
            url: url || BASE_URL,
            type,
            siteName: DEFAULT_SEO.siteName,
            locale: DEFAULT_SEO.locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: title || DEFAULT_SEO.title,
            description: description || DEFAULT_SEO.description,
            image: image || DEFAULT_SEO.image,
            site: DEFAULT_SEO.twitterHandle,
        },
    };
};

/**
 * Category-specific SEO content
 */
export const CATEGORY_SEO = {
    Cars: {
        title: 'Buy & Sell Used Cars',
        description: 'Find the best deals on second-hand cars near you. Browse verified listings of pre-owned cars at great prices. Sell your old car quickly on Kharid Bech.',
        keywords: 'used cars, second hand cars, pre-owned cars, buy used car, sell car, cars for sale near me',
    },
    Bikes: {
        title: 'Buy & Sell Used Bikes & Motorcycles',
        description: 'Discover amazing deals on second-hand bikes and motorcycles. Find pre-owned two-wheelers at affordable prices. List your bike for free on Kharid Bech.',
        keywords: 'used bikes, second hand bikes, pre-owned motorcycles, buy used bike, sell bike, bikes for sale',
    },
    Mobiles: {
        title: 'Buy & Sell Used Mobile Phones',
        description: 'Find great deals on second-hand mobile phones. Browse verified listings of pre-owned smartphones at discounted prices. Sell your old phone on Kharid Bech.',
        keywords: 'used mobiles, second hand phones, pre-owned smartphones, buy used phone, sell mobile, phones for sale',
    },
    Electronics: {
        title: 'Buy & Sell Used Electronics',
        description: 'Discover deals on second-hand electronics including laptops, TVs, cameras & more. Find pre-owned gadgets at great prices on Kharid Bech.',
        keywords: 'used electronics, second hand gadgets, pre-owned laptop, used TV, sell electronics, electronics for sale',
    },
    Appliances: {
        title: 'Buy & Sell Used Home Appliances',
        description: 'Find great deals on second-hand home appliances. Browse pre-owned washing machines, refrigerators, ACs & more at affordable prices.',
        keywords: 'used appliances, second hand washing machine, pre-owned refrigerator, used AC, sell appliances',
    },
    Furniture: {
        title: 'Buy & Sell Used Furniture',
        description: 'Discover amazing deals on second-hand furniture. Find pre-owned sofas, beds, tables, chairs & more at great prices on Kharid Bech.',
        keywords: 'used furniture, second hand sofa, pre-owned bed, used table, sell furniture, furniture for sale',
    },
    Watches: {
        title: 'Buy & Sell Used Watches',
        description: 'Find great deals on second-hand watches. Browse pre-owned luxury and casual watches at discounted prices on Kharid Bech.',
        keywords: 'used watches, second hand watches, pre-owned luxury watch, sell watch, watches for sale',
    },
    Books: {
        title: 'Buy & Sell Used Books',
        description: 'Discover amazing deals on second-hand books. Find pre-owned textbooks, novels & more at great prices. Sell your old books on Kharid Bech.',
        keywords: 'used books, second hand books, pre-owned textbooks, sell books, books for sale',
    },
    Clothing: {
        title: 'Buy & Sell Pre-Owned Clothing',
        description: 'Find great deals on second-hand clothing and accessories. Browse pre-owned fashion items at affordable prices on Kharid Bech.',
        keywords: 'used clothing, second hand clothes, pre-owned fashion, sell clothes, clothing for sale',
    },
    Sports: {
        title: 'Buy & Sell Used Sports Equipment',
        description: 'Discover deals on second-hand sports equipment. Find pre-owned gym gear, fitness equipment & more at great prices on Kharid Bech.',
        keywords: 'used sports equipment, second hand gym gear, pre-owned fitness, sell sports items, sports for sale',
    },
};

/**
 * Generate product schema for individual product pages
 * @param {Object} product - Product details
 * @returns {Object} JSON-LD Product schema
 */
export const generateProductSchema = (product) => {
    if (!product) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images?.[0] || `${BASE_URL}/appLogo.png`,
        sku: product._id,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition',
            seller: {
                '@type': 'Person',
                name: `${product.postedBy?.firstName || ''} ${product.postedBy?.lastName || ''}`.trim(),
            },
            areaServed: {
                '@type': 'Place',
                name: product.location?.city || 'India',
            },
        },
        category: product.category,
    };
};

/**
 * Generate breadcrumb schema
 * @param {Array} items - Array of breadcrumb items
 * @returns {Object} JSON-LD BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (items) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
};

/**
 * Format price for display with INR symbol
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export const formatPriceForSEO = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

export default {
    DEFAULT_SEO,
    generateSEO,
    CATEGORY_SEO,
    generateProductSchema,
    generateBreadcrumbSchema,
    formatPriceForSEO,
    BASE_URL,
};
