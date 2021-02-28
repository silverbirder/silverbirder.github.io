const {src, dest} = require('gulp');
const {DIST_FOLDER_NAME} = require('./variables.js');
const {buildHTMLPipeline} = require('./pipeline/buildHTMLPipeline.js');

const buildHTMLTaskRunner = () => {
    const through = require('through2');
    return src('src/**/*.html')
        .pipe(through.obj(buildHTMLPipeline))
        .pipe(dest(`${DIST_FOLDER_NAME}/`));
};

exports.buildHTMLTaskRunner = buildHTMLTaskRunner;
