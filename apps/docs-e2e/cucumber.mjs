const config = {
  requireModule: ["ts-node/register"],
  require: ["./features/**/*.steps.ts", "./features/**/*.config.ts"],
  format: [
    // "json:reports/cucumber-report.json",
    // "html:reports/report.html",
    // "summary",
    // "progress-bar",
    "@serenity-js/cucumber",
  ],
};

export default config;
