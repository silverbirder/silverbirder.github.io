const convertMarkdownToHTML = (markdownContent) => {
    const markdown = require('markdown-it');
    return markdown({
        html: true,
    })
    .use(require('markdown-it-plantuml'))
    .render(markdownContent);
};

exports.convertMarkdownToHTML = convertMarkdownToHTML;
