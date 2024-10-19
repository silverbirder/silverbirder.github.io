/** @type {import("eslint").Linter.Config} */
const config = {
  rules: {
    "@next/next/no-img-element": "off",
  },
  extends: ["next/core-web-vitals", "next/typescript"],
};
module.exports = config;
