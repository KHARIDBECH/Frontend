/**
 * Utility functions for formatting data across the application.
 */

/**
 * Formats a number as an Indian Rupee string with Lakhs/Thousands suffix
 * @param {number} price 
 * @returns {string}
 */
export const formatPrice = (price) => {
    if (!price && price !== 0) return '';

    if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
        return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Formats a number as a standard Indian currency string (e.g. 1,00,000)
 * @param {number} price 
 * @returns {string}
 */
export const formatFullPrice = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('en-IN').format(price);
};

/**
 * Returns a human-readable relative time string (e.g. "Today", "2d ago")
 * @param {string|Date} date 
 * @returns {string}
 */
export const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    }).format(posted);
};

/**
 * Formats a date string into a long month + day format (e.g. "January 9")
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatLongDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
};
