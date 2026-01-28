import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MdxClientWrapper } from "./mdx-client-wrapper";

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
    h1: "h1",
    p: "p",
    ..._provideComponents(),
    ...props.components
  };
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: "Hello"
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

const meta = {
  component: MdxClientWrapper,
  title: "UI/Domain/MdxClientWrapper",
} satisfies Meta<typeof MdxClientWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    compiledSource: compiledSources.ideal,
  },
};

export const Empty: Story = {
  args: {
    compiledSource: compiledSources.empty,
  },
};

export const Error: Story = {
  args: {
    compiledSource: compiledSources.error,
  },
};

export const Partial: Story = {
  args: {
    compiledSource: compiledSources.partial,
  },
};

export const Loading: Story = {
  args: {
    compiledSource: compiledSources.loading,
  },
};
