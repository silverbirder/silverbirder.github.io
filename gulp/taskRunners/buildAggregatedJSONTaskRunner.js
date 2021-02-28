const {src, dest} = require('gulp');
const {DIST_FOLDER_NAME} = require('./variables.js');
const {buildAggregatedJSONPipeline} = require('./pipeline/buildAggregatedJSONPipeline.js');

const buildAggregatedJSONTaskRunner = () => {
    const through = require('through2');
    return src('src/**/*.json')
        .pipe(through.obj(buildAggregatedJSONPipeline))
        .pipe(dest(`${DIST_FOLDER_NAME}/`));
};

exports.buildAggregatedJSONTaskRunner = buildAggregatedJSONTaskRunner;
