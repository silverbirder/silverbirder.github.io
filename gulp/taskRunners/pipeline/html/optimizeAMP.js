const optimizeAMP = async (html, options, transformOptions) => {
    const toolboxOptimizer = require('@ampproject/toolbox-optimizer');
    return toolboxOptimizer
        .create(options)
        .transformHtml(html, transformOptions);
};

exports.optimizeAMP = optimizeAMP;
