const {BASE_URL} = require('./variables.js');
const SitemapGenerator = require('sitemap-generator');
const fetch = require('node-fetch');

const generateSiteMapRunner = async (cb) => {
    const blogJson = await (await fetch(`${BASE_URL}/blog/index.json`)).json();
    const generator = SitemapGenerator(BASE_URL, {
        filepath: `assets/sitemap.xml`,
        ignoreAMP: false,
    });
    blogJson.items.map((item) => {
        generator.queueURL(item.url);
    });
    generator.on('done', () => {
        cb()
    });
    generator.start();
};

exports.generateSiteMapRunner = generateSiteMapRunner;
