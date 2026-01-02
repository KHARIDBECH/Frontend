const isDev = process.env.NODE_ENV === 'development';

const logger = {
    info: (...args) => {
        if (isDev) console.log('[INFO]', ...args);
    },
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },
    debug: (...args) => {
        if (isDev) console.debug('[DEBUG]', ...args);
    }
};

export default logger;
