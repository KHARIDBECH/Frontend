/**
 * Sitemap Generator for Kharid Bech
 * 
 * This script generates a sitemap.xml file for SEO purposes.
 * Run this script during build or deploy to generate an updated sitemap.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://kharidbech.vercel.app';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static pages
const STATIC_PAGES = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
];

// Categories (same as Constants.js)
const CATEGORIES = [
    'Cars',
    'Bikes',
    'Mobiles',
    'Electronics',
    'Appliances',
    'Furniture',
    'Watches',
    'Books',
    'Clothing',
    'Sports'
];

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(url, lastmod, changefreq, priority) {
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];

    let urls = '';

    // Add static pages
    STATIC_PAGES.forEach(page => {
        urls += generateUrlEntry(
            `${BASE_URL}${page.url}`,
            today,
            page.changefreq,
            page.priority
        );
    });

    // Add category pages
    CATEGORIES.forEach(category => {
        urls += generateUrlEntry(
            `${BASE_URL}/${category}`,
            today,
            'weekly',
            '0.8'
        );
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}
</urlset>`;

    return sitemap;
}

/**
 * Write sitemap to file
 */
function writeSitemap() {
    const sitemap = generateSitemap();

    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
    console.log(`✅ Sitemap generated successfully at: ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${STATIC_PAGES.length + CATEGORIES.length}`);
}

// Run the script
writeSitemap();
