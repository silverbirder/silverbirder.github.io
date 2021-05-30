const {BASE_URL} = require('./variables.js');
const fetch = require('node-fetch');
const RSS = require('rss');
const fs = require('fs');

const generateRSSRunner = async (cb) => {
    // const blogJson = await (await fetch(`${BASE_URL}/blog/index.json`)).json();
    // const feed = new RSS({
    //     title: 'blog - silverbirder',
    //     description: "This is the blog page of silverbirder's portfolio.",
    //     feed_url: `${BASE_URL}/blog/feed.xml`,
    //     site_url: `${BASE_URL}/blog/`,
    //     managingEditor: 'silverbirder@gmail.com (silverbirder)',
    //     webMaster: 'silverbirder@gmail.com (silverbirder)',
    //     language: 'ja',
    //     ttl: '60',
    // });
    // feed.item({
    //     title:  'ブラウザの仕組みを学ぶ',
    //     description: 'Photo by Remotar Jobs on Unsplash Webフロントエンジニアたるもの、ブラウザの仕組みに興味を持つのは自然の摂理です。本記事では、私がブラウザの仕組みを学んでいく過程を備忘録として残します。 みんな大好きCh',
    //     url: `${BASE_URL}/blog/contents/learning_browser_engine`,
    //     author: 'silverbirder', 
    //     date: '2021-05-24T11:28:00.000Z',
    // });
    // const xml = feed.xml();
    // fs.writeFileSync(`assets/blog/feed.xml`, xml);
    cb();
};

exports.generateRSSRunner = generateRSSRunner;
