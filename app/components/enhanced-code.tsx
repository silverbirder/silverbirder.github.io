import hljs from "highlight.js";

export const EnhancedCode = ({ children, className }) => {
  const language = className ? className.replace(/language-/, "") : "text";
  const highlightedCode = hljs.highlight(children.trim(), {
    language,
  }).value;
  return (
    <code
      className="text-xs leading-4"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
};
