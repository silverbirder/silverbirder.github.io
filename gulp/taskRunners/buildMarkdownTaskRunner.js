const {src, dest, series, parallel} = require('gulp');
const {DIST_FOLDER_NAME} = require('./variables.js');
const {buildMarkdownPipeline} = require('./pipeline/buildMarkdownPipeline.js');
const files = [];

const collectFileRunner = () => {
    const through = require('through2');
    return src('src/**/*.md')
        .pipe(through.obj((file, enc, cb) => {
            const targeBlogName = process.env.TARGET_BLOG_NAME || '.*';
            if (file.path.match(new RegExp(targeBlogName))) {
                files.push(file.path);
            }
            cb(null);
        }));
};

const singleBuildMarkdownTaskRunner = (filePath) => {
    const buildMarkdownToTask = () => {
        const rename = require('gulp-rename');
        const through = require('through2');
        const path = require('path');
        const dir = path.dirname(path.relative(`${DIST_FOLDER_NAME}`, filePath)).replace(/^\.\.\/src\//, '');
        return src(filePath)
            .pipe(through.obj(buildMarkdownPipeline))
            .pipe(rename({extname: '.html'}))
            .pipe(dest(`${DIST_FOLDER_NAME}/${dir}`))
    };
    return buildMarkdownToTask;
};

const parallelBuildMarkdownTaskRunner = (done) => {
    const tasks = files.map(path => singleBuildMarkdownTaskRunner(path));
    parallel(...tasks)();
    done();
};

const buildMarkdownTaskRunner = (done) => {
    series(collectFileRunner, parallelBuildMarkdownTaskRunner)();
    done();
};

exports.buildMarkdownTaskRunner = buildMarkdownTaskRunner;
