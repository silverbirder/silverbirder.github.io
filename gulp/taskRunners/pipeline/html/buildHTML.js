const {BASE_URL} = require('../../variables.js');
const jsdom = require('jsdom');
const hljs = require('highlight.js');
const {JSDOM} = jsdom;
const regEmoji = new RegExp(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/, 'g');
const regSpace = new RegExp(/\s+/, 'g');

const concatHeadAndMain = (contentDOM, layoutDOM) => {
    const contentHeadElement = contentDOM.window.document.querySelector('head');
    const layoutHeadElement = layoutDOM.window.document.querySelector('head');
    layoutHeadElement.innerHTML += contentHeadElement.innerHTML;
    const contentMainElement = contentDOM.window.document.querySelector('main');
    const layoutMainElement = layoutDOM.window.document.querySelector('main');
    layoutMainElement.innerHTML = contentMainElement.innerHTML;
};

const addAnchorToHeader = (layoutDOM) => {
    const headerElementList = layoutDOM.window.document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    Array.prototype.forEach.call(headerElementList, (element) => {
        const normalizedValue = element.innerHTML
            .toLowerCase()
            .replace(/\s/gi, '_');
        const startHeaderNumber = parseInt(element.tagName.slice(1));
        const anchorIcon = '#'.repeat(startHeaderNumber);
        const anchorTag = `<a class="anchor" aria-label="Anchor" data-anchor-icon="${anchorIcon}" href="#${normalizedValue}"></a>`;
        element.innerHTML = `${anchorTag}${element.innerHTML}`;
        element.setAttribute('id', normalizedValue);
    });
};

const replaceUrl = (layoutDOM, canonicalUrl) => {
    const urlElementList = layoutDOM.window.document.querySelectorAll('[src],[href],[data-share-endpoint],[config]');
    Array.prototype.forEach.call(urlElementList, (element) => {
        const href = element.getAttribute('href');
        const src = element.getAttribute('src');
        const endpoint = element.getAttribute('data-share-endpoint');
        const config = element.getAttribute('config');
        if (href && href.match(/(BASE_URL|CANONICAL_URL)/)) {
            element.setAttribute('href', href
                .replace(/BASE_URL/, BASE_URL)
                .replace(/CANONICAL_URL/, canonicalUrl)
            );
        }
        if (src && src.match(/(BASE_URL|CANONICAL_URL)/)) {
            element.setAttribute('src', src
                .replace(/BASE_URL/, BASE_URL)
                .replace(/CANONICAL_URL/, canonicalUrl)
            );
        }
        if (endpoint && endpoint.match(/(BASE_URL|CANONICAL_URL)/)) {
            element.setAttribute('data-share-endpoint', endpoint
                .replace(/BASE_URL/, BASE_URL)
                .replace(/CANONICAL_URL/, canonicalUrl)
            );
        }
        if (config && config.match(/(BASE_URL|CANONICAL_URL)/)) {
            element.setAttribute('config', config
                .replace(/BASE_URL/, BASE_URL))
        }
    });
};

const addLdJson = (layoutDOM, canonicalUrl) => {
    const headElement = layoutDOM.window.document.querySelector('head');
    const scriptElement = layoutDOM.window.document.createElement('script');
    scriptElement.setAttribute('type', 'application/ld+json');
    scriptElement.innerHTML = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Webpage",
        "url": canonicalUrl,
        "name": "Silverbirder's portfolio",
        "headline": "Show my portfolio",
        "description": "My contents is self intro, blog, projects, and books.",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": BASE_URL
        },
        "publisher": {
            "@type": "Person",
            "name": "silverbirder",
            "image": "https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_520/v1611128736/silver-birder.github.io/assets/logo.png"
        }
    });
    headElement.appendChild(scriptElement);
};

const highlight = (layoutDOM) => {
    const codeElementList = layoutDOM.window.document.querySelectorAll('pre code');
    Array.prototype.forEach.call(codeElementList, (element) => {
        hljs.highlightBlock(element);
    });
};

const replaceEmbed = (layoutDOM) => {
    const result = layoutDOM.window.document.evaluate('//*[contains(text(), \':embed\')]', layoutDOM.window.document, null, 0, null);
    while (true) {
        const element = result.iterateNext();
        if (element === null) {
            break;
        }
        const embedRegex = new RegExp("\\[(?<url>[^\\[]+):embed]");
        const embedMatch = element.innerHTML.match(embedRegex);
        if (!(embedMatch && embedMatch.groups && embedMatch.groups.url)) {
            continue;
        }
        const url = embedMatch.groups.url.replace(/BASE_URL/, BASE_URL);
        const ampEmbedlyCardTag = `
                <amp-embedly-card
                    media="(prefers-color-scheme: dark)"
                    data-url="${url}"
                    layout="responsive"
                    data-card-theme="dark"
                    width="100"
                    height="50">
                </amp-embedly-card>
                <amp-embedly-card
                        media="(prefers-color-scheme: light)"
                        data-url="${url}"
                        layout="responsive"
                        data-card-theme="light"
                        width="100"
                        height="50">
                </amp-embedly-card>`;
        element.innerHTML = element.innerHTML.replace(embedRegex, ampEmbedlyCardTag);
    }
};

const replaceTableContent = (layoutDOM) => {
    const result = layoutDOM.window.document.evaluate('//*[contains(text(), \'[:contents]\')]', layoutDOM.window.document, null, 0, null);
    const element = result.iterateNext();
    if (element === null) {
        return;
    }
    const toc = require('toc');
    const mainElement = layoutDOM.window.document.querySelector('main');
    const headers = toc.anchorize(mainElement.innerHTML, {tocMin: 1, anchorMin: 1}).headers.map((header) => {
        header.anchor = header.attrs.match(/id="(?<id>[^"]+)"/).groups.id;
        return header;
    });
    element.innerHTML = toc.toc(headers, {TOC: '<div class="table-of-contents"><%= toc %></div>'});
};

const addHeadTag = (layoutDOM, option) => {
    const headElement = layoutDOM.window.document.querySelector('head');
    const descriptionElement = layoutDOM.window.document.querySelector('meta[name="description"]');
    const titleElement = layoutDOM.window.document.querySelector('title');
    const iconElement = layoutDOM.window.document.querySelector('link[rel="icon"]');
    if (descriptionElement === null) {
        if (option['description'] !== undefined && option['description'] !== '') {
            const newDescriptionElement = layoutDOM.window.document.createElement('meta');
            newDescriptionElement.setAttribute('name', 'description');
            newDescriptionElement.setAttribute('content', option['description']);
            headElement.appendChild(newDescriptionElement);
        }  else {
            const mainValue = layoutDOM.window.document.querySelector('main').textContent;
            const description = mainValue.trim().replace(regSpace, ' ').replace(regEmoji, '').slice(0, 120);
            const newDescriptionElement = layoutDOM.window.document.createElement('meta');
            newDescriptionElement.setAttribute('name', 'description');
            newDescriptionElement.setAttribute('content', description);
            headElement.appendChild(newDescriptionElement);
        }
    }
    if (titleElement === null && option['title'] !== undefined && option['title'] !== '') {
        const newTitleElement = layoutDOM.window.document.createElement('title');
        newTitleElement.textContent = option['title'];
        headElement.appendChild(newTitleElement);
    }
    if (iconElement === null && option['icon'] !== undefined && option['icon'] !== '') {
        const newIconElement = layoutDOM.window.document.createElement('link');
        newIconElement.setAttribute('rel', 'icon');
        newIconElement.setAttribute('href', `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${option['icon']}</text></svg>`);
        headElement.appendChild(newIconElement);
    }
};

const addOGP = (layoutDOM, option) => {
    let src = '';
    let title = '';
    let description = '';
    const imgElement = layoutDOM.window.document.querySelector('img');
    const titleElement = layoutDOM.window.document.querySelector('title');
    const descriptionElement = layoutDOM.window.document.querySelector('meta[name="description"]');
    const imgOption = option['image'];
    if (imgOption) {
        src = imgOption;
    } else if (imgElement !== null) {
        src = imgElement.getAttribute('src');
    } else {
        src = 'https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png';
    }
    if (titleElement !== null) {
        title = titleElement.textContent;
        titleElement.textContent = `${title} - silverbirder`;
    }
    if (descriptionElement !== null) {
        description = descriptionElement.getAttribute('content');
    }
    const excludeEmojiTitle = title.replace(regEmoji, '');
    const headElement = layoutDOM.window.document.querySelector('head');

    // base OGP
    const ogMetaImage = layoutDOM.window.document.createElement('meta');
    ogMetaImage.setAttribute('property', 'og:image');
    const header = `w_500,b_black,co_white,c_fit,g_north,l_text:Arial_30_bold_center:silverbirder`;
    const customTitle = `w_500,h_50,b_black,co_white,c_fit,g_south,l_text:Arial_20_bold:${encodeURIComponent(excludeEmojiTitle)}`;
    const imageUrl = `https://res.cloudinary.com/silverbirder/image/fetch/f_auto,w_500/${header}/${customTitle}/${src}`;
    ogMetaImage.setAttribute('content', `${imageUrl}`);
    const ogMetaUrl = layoutDOM.window.document.createElement('meta');
    ogMetaUrl.setAttribute('property', 'og:url');
    ogMetaUrl.setAttribute('content', option['canonical']);
    const ogMetaSiteName = layoutDOM.window.document.createElement('meta');
    ogMetaSiteName.setAttribute('property', 'og:site_name');
    ogMetaSiteName.setAttribute('content', "silverbirder's page");
    const ogMetaTitle = layoutDOM.window.document.createElement('meta');
    ogMetaTitle.setAttribute('property', 'og:title');
    ogMetaTitle.setAttribute('content', title);
    const ogMetaDescription = layoutDOM.window.document.createElement('meta');
    ogMetaDescription.setAttribute('property', 'og:description');
    ogMetaDescription.setAttribute('content', description);
    const ogMetaType = layoutDOM.window.document.createElement('meta');
    ogMetaType.setAttribute('property', 'og:type');
    const type = `${BASE_URL}/` === option['canonical'] ? 'website': 'article';
    ogMetaType.setAttribute('content', type);

    const ogMetaTwitterCard = layoutDOM.window.document.createElement('meta');
    ogMetaTwitterCard.setAttribute('name', 'twitter:card');
    ogMetaTwitterCard.setAttribute('content', 'summary');
    const ogMetaTwitterTitle = layoutDOM.window.document.createElement('meta');
    ogMetaTwitterTitle.setAttribute('name', 'twitter:title');
    ogMetaTwitterTitle.setAttribute('content', title);
    const ogMetaTwitterImage = layoutDOM.window.document.createElement('meta');
    ogMetaTwitterImage.setAttribute('name', 'twitter:image');
    ogMetaTwitterImage.setAttribute('content', imageUrl);
    const ogMetaTwitterSite = layoutDOM.window.document.createElement('meta');
    ogMetaTwitterSite.setAttribute('name', 'twitter:site');
    ogMetaTwitterSite.setAttribute('content', 'silver_birder');

    const ogMetaFacebookAppId = layoutDOM.window.document.createElement('meta');
    ogMetaFacebookAppId.setAttribute('property', 'fb:app_id');
    ogMetaFacebookAppId.setAttribute('content', '757288804895366');

    headElement.appendChild(ogMetaImage);
    headElement.appendChild(ogMetaUrl);
    headElement.appendChild(ogMetaSiteName);
    headElement.appendChild(ogMetaTitle);
    headElement.appendChild(ogMetaDescription);
    headElement.appendChild(ogMetaType);
    headElement.appendChild(ogMetaTwitterCard);
    headElement.appendChild(ogMetaTwitterTitle);
    headElement.appendChild(ogMetaTwitterImage);
    headElement.appendChild(ogMetaTwitterSite);
    headElement.appendChild(ogMetaFacebookAppId);
};

const buildHTML = (content, layout, option) => {
    const canonicalUrl = option['canonical'];
    const contentDOM = new JSDOM(content);
    const layoutDOM = new JSDOM(layout);
    concatHeadAndMain(contentDOM, layoutDOM);
    addAnchorToHeader(layoutDOM);
    replaceUrl(layoutDOM, canonicalUrl);
    addLdJson(layoutDOM, canonicalUrl);
    highlight(layoutDOM);
    replaceEmbed(layoutDOM);
    replaceTableContent(layoutDOM);
    addHeadTag(layoutDOM, option);
    addOGP(layoutDOM, option);
    return layoutDOM.serialize();
};

exports.buildHTML = buildHTML;
