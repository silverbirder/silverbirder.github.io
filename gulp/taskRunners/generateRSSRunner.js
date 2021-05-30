const fs = require('fs');

const fetch = require('node-fetch');
const RSS = require('rss');
const jsdom = require('jsdom');

const {BASE_URL} = require('./variables.js');
const {JSDOM} = jsdom;

const generateRSSRunner = async (cb) => {
    const RSS_PATH = `blog/feed.xml`;
    const feedCore = await (async () => {
        const html = await (await fetch(`${BASE_URL}/blog/`)).text();
        const dom = new JSDOM(html);
        const head = dom.window.document.querySelector('head');
        return {
            title: head.querySelector('title').textContent,
            description: head.querySelector('meta[name="description"]').getAttribute('content'),
        }
    })();

    const feed = new RSS(Object.assign(feedCore, {
        feed_url: `${BASE_URL}/${RSS_PATH}`,
        site_url: `${BASE_URL}/blog/`,
        managingEditor: 'silverbirder@gmail.com (silverbirder)',
        webMaster: 'silverbirder@gmail.com (silverbirder)',
        language: 'ja',
    }));

    const blogJson = await (await fetch(`${BASE_URL}/blog/index.json`)).json();
    (await Promise.all(blogJson.items.map(async (item) => {
        const html = await (await fetch(item.url)).text();
        const dom = new JSDOM(html);
        const head = dom.window.document.querySelector('head');
        return {
            title: head.querySelector('title').textContent,
            description: head.querySelector('meta[name="description"]').getAttribute('content'),
            url: item.url,
            author: 'silverbirder',
            date: item.date,
            sort: (new Date(item.date)).getTime()
        };
    }))).sort((a, b) => {
        return a.sort - b.sort;
    }).map((item) => {
        feed.item(item);
    });
    const xml = feed.xml({indent: true});
    fs.writeFileSync(`assets/${RSS_PATH}`, xml);
    cb();
};

exports.generateRSSRunner = generateRSSRunner;
