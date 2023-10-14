import OneSignal from "onesignal-node";

const client = new OneSignal.Client(
  process.env.ONE_SIGNAL_APP_ID,
  process.env.ONE_SIGNAL_API_KEY
);

async function sendNotification(article) {
  const { title, permalink } = JSON.parse(article);

  const notification = {
    contents: {
      ja: `${title}の新しいブログ記事が公開されました！`,
      en: `A new blog post titled "${title}" has been published!`,
    },
    headings: {
      ja: "新しいブログ記事",
      en: "New Blog Post",
    },
    url: `https://silverbirder.github.io/${permalink}`,
    chrome_web_icon:
      "https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/pinterest_profile_image.png",
    included_segments: ["Test Users"],
    web_buttons: [
      {
        id: "read-more-button",
        text: "もっと読む",
        icon: "http://i.imgur.com/MIxJp1L.png",
        url: `https://yourwebsite.com${permalink}`,
      },
    ],
  };

  try {
    const response = await client.createNotification(notification);
    console.log(
      `Notification sent for article: ${title}. Response ID: ${response.body.id}`
    );
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      console.error(e.statusCode);
      console.error(e.body);
    }
  }
}

sendNotification(process.argv[2]);
