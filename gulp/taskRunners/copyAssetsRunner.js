const {src, dest} = require('gulp');
const {DIST_FOLDER_NAME} = require('./variables.js');

const copyAssetsRunner = () => {
    return src('assets/**/*')
        .pipe(dest(`${DIST_FOLDER_NAME}/`));
};

exports.copyAssetsRunner = copyAssetsRunner;
