const {generateCanonicalUrl} = require('./utils.js');

const extractMarkdownToJSONPipeline = async (file, enc, cb) => {
    const content = file.contents.toString();
    const filePath = file.history[0];
    const headRegex = new RegExp("<!--(?<content>((?!-->).*\n)*?)-->");
    const head = content.match(headRegex).groups.content.trim();
    const splitRegex = new RegExp("(?<=^[^:]+?):");
    const responseJson = {};
    head.split('\n').map((rows) => {
        const [key, value] = rows.split(splitRegex);
        responseJson[key.trim()] = value.trim();
    });
    responseJson['url'] = generateCanonicalUrl(filePath)
        .replace(/\.md$/, '');
    file.contents = Buffer.from(JSON.stringify(responseJson));
    cb(null, file)
};

exports.extractMarkdownToJSONPipeline = extractMarkdownToJSONPipeline;
