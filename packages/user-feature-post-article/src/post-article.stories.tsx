import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostArticle } from "./post-article";

const compiledSources = {
  empty: `"use strict";
const {Fragment: _Fragment, jsx: _jsx} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  return _jsx(_Fragment, {});
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`,
  error: `"use strict";
const {jsx: _jsx} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  return _jsx("p", {
    role: "alert",
    children: "We could not load this entry."
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`,
  ideal: `"use strict";
const {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    p: "p",
    ..._provideComponents(),
    ...props.components
  };
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h2, {
      children: "Overview"
    }), "\\n", _jsx(_components.p, {
      children: "This is a test."
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`,
  loading: `"use strict";
const {jsx: _jsx} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  return _jsx("p", {
    "aria-busy": "true",
    children: "Loading notes..."
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`,
  partial: `"use strict";
const {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    p: "p",
    ..._provideComponents(),
    ...props.components
  };
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h2, {
      children: "Summary"
    }), "\\n", _jsx(_components.p, {
      children: "Only the key takeaway for now."
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`,
};

const followLinks = {
  bluesky: "https://bsky.app/profile/example.bsky.social",
  github: "https://github.com/example",
  rss: "https://example.com/rss.xml",
  threads: "https://www.threads.com/@example",
  x: "https://x.com/example",
};

const meta = {
  component: PostArticle,
  title: "Feature/User/PostArticle",
} satisfies Meta<typeof PostArticle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    compiledSource: compiledSources.ideal,
    followLinks,
    meta: {
      postNumber: 12,
      publishedAt: "2025-01-12",
      tags: ["Chakra UI", "MDX", "Design"],
      title: "Notebook Prose with Chakra",
    },
    navigation: {},
    relatedPosts: [],
    shareUrl: "https://example.com/blog/contents/notebook-prose/",
    slug: "notebook-prose",
  },
};

export const Empty: Story = {
  args: {
    compiledSource: compiledSources.empty,
    followLinks,
    meta: {
      postNumber: 12,
      publishedAt: "2025-01-12",
      tags: ["Chakra UI", "MDX", "Design"],
      title: "Notebook Prose with Chakra",
    },
    navigation: {},
    relatedPosts: [],
    shareUrl: "https://example.com/blog/contents/notebook-prose/",
    slug: "notebook-prose",
  },
};

export const Error: Story = {
  args: {
    compiledSource: compiledSources.error,
    followLinks,
    meta: {
      postNumber: 12,
      publishedAt: "2025-01-12",
      tags: ["Chakra UI", "MDX", "Design"],
      title: "Notebook Prose with Chakra",
    },
    navigation: {},
    relatedPosts: [],
    shareUrl: "https://example.com/blog/contents/notebook-prose/",
    slug: "notebook-prose",
  },
};

export const Partial: Story = {
  args: {
    compiledSource: compiledSources.partial,
    followLinks,
    meta: {
      postNumber: 12,
      publishedAt: "2025-01-12",
      tags: ["Chakra UI", "MDX", "Design"],
      title: "Notebook Prose with Chakra",
    },
    navigation: {},
    relatedPosts: [],
    shareUrl: "https://example.com/blog/contents/notebook-prose/",
    slug: "notebook-prose",
  },
};

export const Loading: Story = {
  args: {
    compiledSource: compiledSources.loading,
    followLinks,
    meta: {
      postNumber: 12,
      publishedAt: "2025-01-12",
      tags: ["Chakra UI", "MDX", "Design"],
      title: "Notebook Prose with Chakra",
    },
    navigation: {},
    relatedPosts: [],
    shareUrl: "https://example.com/blog/contents/notebook-prose/",
    slug: "notebook-prose",
  },
};

export const WithNavigation: Story = {
  args: {
    compiledSource: compiledSources.ideal,
    followLinks,
    meta: {
      postNumber: 12,
      publishedAt: "2025-01-12",
      tags: ["Chakra UI", "MDX", "Design"],
      title: "Notebook Prose with Chakra",
    },
    navigation: {
      next: {
        href: "/blog/contents/next-post",
        publishedAt: "2025-01-13",
        title: "Next Post Title",
      },
      prev: {
        href: "/blog/contents/prev-post",
        publishedAt: "2025-01-11",
        title: "Previous Post Title",
      },
    },
    relatedPosts: [],
    shareUrl: "https://example.com/blog/contents/notebook-prose/",
    slug: "notebook-prose",
  },
};
