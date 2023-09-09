const fs = require("fs");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");
const downloadImage = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Check if the response has an image content type
    if (
      response.headers["content-type"] &&
      response.headers["content-type"].startsWith("image/")
    ) {
      return Buffer.from(response.data, "binary");
    } else {
      console.log(`Non-image content type received from URL: ${url}`);
      return null;
    }
  } catch (error) {
    return null;
  }
};

const skippedImages = [];
let addedImportStatement = false;

const processFiles = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      await processFiles(filePath);
    } else if (
      path.extname(filePath) === ".mdx" &&
      filePath !==
        path.join(directoryPath, "intro_google_account_photo_api/index.mdx")
    ) {
      let content = fs.readFileSync(filePath, "utf-8");

      const imageRegex =
        /!\[(.*?)\]\((.*?)\)|<img\s+(?:(?:alt="(.*?)"\s+)?src="(.*?)"|(?:src="(.*?)"\s+)?alt="(.*?)")(?:\s+[^>]*?)?\s*\/?>/gs;

      let match;

      while ((match = imageRegex.exec(content))) {
        const alt = match[1] || match[3] || match[6];
        const url = match[2] || match[4] || match[5];

        if (url.startsWith("http")) {
          // Remote image
          const imageBuffer = await downloadImage(url);

          if (imageBuffer) {
            addedImportStatement = true;
            const imageDimensions = await sharp(imageBuffer).metadata();
            content = content.replace(
              match[0],
              `<Image\n\tsrc="${url}"\n\twidth={${imageDimensions.width}}\n\theight={${imageDimensions.height}}\n\tlayout="constrained"\n\talt="${alt}"\n/>`
            );
          } else {
            skippedImages.push({ url, filePath });
          }
        }
      }

      // If we added an Image component, insert the import statement after the metadata section
      if (
        addedImportStatement &&
        !content.includes('import { Image } from "@unpic/qwik";')
      ) {
        content = content.replace(
          /---\n\n/,
          '---\n\nimport { Image } from "@unpic/qwik";\n\n'
        );
        addedImportStatement = false;
      }

      fs.writeFileSync(filePath, content, "utf-8");
    }
  }
};

const directoryPath = "../docs/src/routes/blog/contents";
processFiles(directoryPath).then(() => {
  if (skippedImages.length > 0) {
    console.log("Skipped the following images due to download errors:");
    for (const skipped of skippedImages) {
      console.log(`URL: ${skipped.url}, Path: ${skipped.filePath}`);
    }
  }
});
