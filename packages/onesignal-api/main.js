const { execSync } = require("child_process");
const fs = require("fs");
const OneSignal = require("onesignal-node");

const appId = process.env.PUBLIC_ONE_SIGNAL_APP_ID || "";
const restApiKey = process.env.PUBLIC_ONE_SIGNAL_REST_API_KEY || "";
const client = new OneSignal.Client(appId, restApiKey);

function sendNotificationToOnesignal(article, locale) {
  const urlPrefix = locale === "en-US" ? "/en-US" : "";
  const notification = {
    contents: {
      ja: article.description,
      en: article.description,
    },
    headings: {
      ja: "🎉記事を公開",
      en: "🎉Published blog post",
    },
    subtitle: {
      ja: article.title,
      en: article.title,
    },
    chrome_web_icon:
      "https://res.cloudinary.com/silverbirder/image/upload/v1697627893/silver-birder.github.io/assets/logo_256.png",
    firefox_icon:
      "https://res.cloudinary.com/silverbirder/image/upload/v1697627893/silver-birder.github.io/assets/logo_256.png",
    chrome_web_image:
      article.socialMediaImage ||
      "https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/linkedin_banner_image_1.png",
    url: `https://silverbirder.github.io${article.permalink}`,
    filters: [{ field: "language", relation: "=", value: "ja" }],
    url: `https://silverbirder.github.io${urlPrefix}${article.permalink}`,
    filters: [
      locale === "en-US"
        ? {
            field: "language",
            relation: "!=",
            value: "ja",
          }
        : {
            field: "language",
            relation: "=",
            value: "ja",
          },
    ],
  };

  client
    .createNotification(notification)
    .then((response) => {
      console.log("Notification sent:", response.body);
    })
    .catch((e) => {
      console.error("Error sending notification:", e);
    });
}

function getFileContentFromGit(filePath, commit) {
  try {
    return execSync(`git show ${commit}:"${filePath}"`, { encoding: "utf-8" });
  } catch (error) {
    console.error(
      `Failed to retrieve content from commit ${commit} for file ${filePath}.`,
      error
    );
    return null;
  }
}

function transformToKeyValue(jsonArray) {
  const result = {};
  jsonArray.forEach((entry) => {
    result[entry.permalink] = { ...entry };
  });
  return result;
}

function getNewlyPublishedForLocale(locale) {
  const filePath = `apps/docs/src/routes/${locale}/blog/index.json`;

  const currentCommitContent = fs.readFileSync(filePath, "utf-8");
  const previousCommitContent = getFileContentFromGit(filePath, "HEAD^");

  if (!previousCommitContent) {
    console.error(
      `Couldn't fetch the content from the previous commit for locale ${locale}.`
    );
    return [];
  }

  const currentData = transformToKeyValue(JSON.parse(currentCommitContent));
  const previousData = transformToKeyValue(JSON.parse(previousCommitContent));

  const newlyPublished = [];

  for (const permalink in currentData) {
    if (
      (!previousData[permalink] && currentData[permalink].published) ||
      (previousData[permalink] &&
        !previousData[permalink].published &&
        currentData[permalink].published)
    ) {
      newlyPublished.push(currentData[permalink]);
    }
  }

  return newlyPublished;
}

const locales = ["(ja)", "en-US"];

locales.forEach((locale) => {
  const articlesToNotify = getNewlyPublishedForLocale(locale);
  console.log({ locale, articlesToNotify });
  articlesToNotify.forEach((article) =>
    sendNotificationToOnesignal(article, locale)
  );
});
