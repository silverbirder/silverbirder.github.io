const {generateCanonicalUrl} = require('./utils.js');
const {convertMarkdownToHTML} = require('./html/convertMarkdownToHTML.js');
const {optimizeAMP} = require('./html/optimizeAMP.js');
const {buildHTML} = require('./html/buildHTML.js');

const {extractMarkdownToJSONPipeline} = require('./extractMarkdownToJSONPipeline.js');

const buildMarkdownPipeline = async (file, enc, cb) => {
    const fs = require('fs');
    const markdownHtml = convertMarkdownToHTML(file.contents.toString());
    const filePath = file.history[0];
    const canonicalUrl = generateCanonicalUrl(filePath).replace(/\.md$/, '');
    const layout = fs.readFileSync('./templates/layout.html', 'utf-8');
    const cloneFile = Object.create(file);
    await extractMarkdownToJSONPipeline(cloneFile, enc, (_1, _2) => {
    });
    const markdownJson = JSON.parse(cloneFile.contents.toString());
    markdownJson['canonical'] = canonicalUrl;
    const html = await optimizeAMP(
        buildHTML(`<main>${markdownHtml}</main>`, layout, markdownJson), {
            markdown: true
        }, {canonical: canonicalUrl});
    file.contents = Buffer.from(html);
    cb(null, file)
};

exports.buildMarkdownPipeline = buildMarkdownPipeline;
