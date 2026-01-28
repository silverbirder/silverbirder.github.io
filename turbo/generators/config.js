module.exports = function generator(plop) {
  plop.setHelper("ensureRelative", (input) => {
    if (typeof input !== "string") return "";
    const trimmed = input.trim();
    if (!trimmed.length) return "";
    return trimmed.startsWith("./") ||
      trimmed.startsWith("../") ||
      trimmed.startsWith("/")
      ? trimmed.replace(/^\/*/, "")
      : trimmed;
  });
  plop.setHelper("lowerCase", (input) =>
    typeof input === "string" ? input.toLowerCase() : ""
  );

  plop.setGenerator("feature", {
    description: "Create a shareable feature package under packages/",
    prompts: [
      {
        type: "list",
        name: "app",
        message: "Which application is this feature for?",
        choices: [
          { name: "admin", value: "admin" },
          { name: "user", value: "user" },
        ],
        default: "admin",
      },
      {
        type: "input",
        name: "name",
        message: "What is the feature name?",
        validate: (input) =>
          (input && input.trim().length > 0) || "A feature name is required.",
      },
    ],
    actions: (answers) => {
      const workspaceFolder = plop.renderString(
        "{{dashCase app}}-feature-{{dashCase name}}",
        answers
      );
      const packageDir = `packages/${workspaceFolder}`;
      const featureDir = `${packageDir}/src`;
      const indexPath = `${featureDir}/index.ts`;
      const sortKeys = (obj) =>
        Object.fromEntries(
          Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
        );

      const actions = [
        {
          type: "add",
          path: plop.renderString(`${packageDir}/package.json`, answers),
          templateFile: "templates/feature/package.json.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(`${packageDir}/tsconfig.json`, answers),
          templateFile: "templates/feature/tsconfig.json.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(`${packageDir}/vitest.config.ts`, answers),
          templateFile: "templates/feature/vitest.config.ts.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(`${packageDir}/eslint.config.mjs`, answers),
          templateFile: "templates/feature/eslint.config.mjs.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(
            `${featureDir}/{{kebabCase name}}.tsx`,
            answers
          ),
          templateFile: "templates/feature/component.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(
            `${featureDir}/{{kebabCase name}}.stories.tsx`,
            answers
          ),
          templateFile: "templates/feature/component.stories.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(
            `${featureDir}/{{kebabCase name}}.spec.tsx`,
            answers
          ),
          templateFile: "templates/feature/component.spec.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(`${featureDir}/test-util/render.tsx`, answers),
          templateFile: "templates/feature/test-util/render.tsx.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(`${featureDir}/test-util/index.ts`, answers),
          templateFile: "templates/feature/test-util/index.ts.hbs",
          skipIfExists: true,
        },
        {
          type: "add",
          path: plop.renderString(indexPath, answers),
          templateFile: "templates/feature/index.ts.hbs",
          skipIfExists: true,
        },
        {
          type: "modify",
          path: `apps/${answers.app}/package.json`,
          transform: (content) => {
            const pkgJson = JSON.parse(content);
            const dependencyName = `@repo/${workspaceFolder}`;
            pkgJson.dependencies = pkgJson.dependencies || {};
            if (!pkgJson.dependencies[dependencyName]) {
              pkgJson.dependencies[dependencyName] = "workspace:*";
              pkgJson.dependencies = sortKeys(pkgJson.dependencies);
            }
            return `${JSON.stringify(pkgJson, null, 2)}\n`;
          },
        },
      ];

      return actions;
    },
  });
};
