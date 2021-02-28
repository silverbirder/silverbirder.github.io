const {BASE_URL} = require('../variables.js');

const streamToString = (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(chunks));
    })
};

const generateCanonicalUrl = (filePath) => {
    const path = require('path');
    const contentPath = path
        .relative(__dirname, filePath)
        .replace(/^\.\.\/\.\.\/\.\.\/src\//, '');
    return `${BASE_URL}/${contentPath}`;
};

module.exports = {
    streamToString,
    generateCanonicalUrl
};
