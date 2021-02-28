const {optimizeAMP} = require('./html/optimizeAMP.js');
const {buildHTML} = require('./html/buildHTML.js');
const {generateCanonicalUrl} = require('./utils.js');

const buildHTMLPipeline = async (file, enc, cb) => {
    const fs = require('fs');
    const layout = fs.readFileSync('./templates/layout.html', 'utf-8');
    const filePath = file.history[0];
    const canonicalUrl = generateCanonicalUrl(filePath).replace(/index\.html$/, '');
    const html = await optimizeAMP(
        buildHTML(file.contents.toString(), layout, {canonical: canonicalUrl}),
        {},
        {canonical: canonicalUrl}
    );
    file.contents = Buffer.from(html);
    cb(null, file)
};

exports.buildHTMLPipeline = buildHTMLPipeline;
