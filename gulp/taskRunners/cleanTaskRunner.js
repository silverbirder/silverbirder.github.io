const {DIST_FOLDER_NAME} = require('./variables.js');

const cleanTaskRunner = () => {
    const del = require('del');
    return del([
        `${DIST_FOLDER_NAME}`
    ]);
};

exports.cleanTaskRunner = cleanTaskRunner;
