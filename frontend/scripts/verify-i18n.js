const fs = require('fs');
const path = require('path');

const locales = ['en', 'de', 'ar'];
const messagesDir = path.join(__dirname, '../messages');

const files = {};
locales.forEach(locale => {
    files[locale] = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf8'));
});

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...getKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);
}

const allKeys = new Set();
const localeKeys = {};

locales.forEach(locale => {
    const keys = getKeys(files[locale]);
    localeKeys[locale] = new Set(keys);
    keys.forEach(k => allKeys.add(k));
});

console.log('--- Missing Keys Report ---');
let hasMissing = false;

allKeys.forEach(key => {
    const missingIn = locales.filter(l => !localeKeys[l].has(key));
    if (missingIn.length > 0) {
        hasMissing = true;
        console.log(`Key '${key}' is missing in: ${missingIn.join(', ')}`);
    }
});

if (!hasMissing) {
    console.log('✅ All keys are present in all locales.');
} else {
    console.log('❌ Some keys are missing.');
    process.exit(1);
}
