const {series, parallel, watch} = require('gulp');
const {runners} = require('./gulp/index.js');

exports.build = series(
    runners.cleanTaskRunner,
    parallel(
        runners.buildMarkdownTaskRunner,
        runners.buildHTMLTaskRunner,
        runners.buildAggregatedJSONTaskRunner,
        runners.copyAssetsRunner
    )
);

exports.watch = () => {
    watch([
        'src/**/*.html',
        'src/**/*.md',
        'templates/*',
        'assets/*'
    ], exports.build)
};

exports.buildForCrawlers = series(
    parallel(
        runners.generateSiteMapRunner,
        runners.generateRSSRunner
    )
);
