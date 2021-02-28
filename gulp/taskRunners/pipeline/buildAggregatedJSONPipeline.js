const {src} = require('gulp');
const {extractMarkdownToJSONPipeline} = require('./extractMarkdownToJSONPipeline.js');
const {streamToString} = require('./utils.js');

const buildAggregatedJSONPipeline = async (file, enc, cb) => {
    const path = require('path');
    const through = require('through2');
    const filePath = file.history[0];
    const jsonDir = path.dirname(`${filePath}`);
    const jsonFile = JSON.parse(file.contents.toString());
    if (jsonFile.source === undefined) {
        cb(null, file);
        return;
    }
    const jsonList = (await streamToString(
        await src(path.join(jsonDir, jsonFile.source))
            .pipe(through.obj(extractMarkdownToJSONPipeline))
    )).map((markdownJson) => {
        return JSON.parse(markdownJson.contents.toString());
    }).map((markdownJson) => {
        markdownJson['draft'] = markdownJson['draft'] === 'true';
        const d = new Date(markdownJson['date']);
        markdownJson['date'] = d;
        markdownJson['humanDate'] = `${d.getFullYear()}/${('00' + (d.getMonth() + 1)).slice(-2)}/${('00' + d.getDate()).slice(-2)}`;
        markdownJson['image'] = markdownJson['image'] !== '' ? markdownJson['image'] : null;
        markdownJson['description'] = markdownJson['description'] !== '' ? markdownJson['description'] : null;
        return markdownJson;
    }).filter((markdownJson) => {
        return markdownJson.draft === false
    }).sort((a, b) => {
        if (a.date > b.date) {
            return -1
        } else if (a.date < b.date) {
            return 1
        } else {
            return 0
        }
    });
    const fileJson = JSON.parse(file.contents.toString());
    fileJson.items = jsonList;
    file.contents = Buffer.from(JSON.stringify(fileJson));
    cb(null, file)
};

exports.buildAggregatedJSONPipeline = buildAggregatedJSONPipeline;
