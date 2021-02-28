const convertMarkdownToHTML = (markdownContent) => {
    const markdown = require('markdown-it');
    return markdown({
        html: true,
    }).render(markdownContent);
};

exports.convertMarkdownToHTML = convertMarkdownToHTML;
