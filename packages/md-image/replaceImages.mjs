import fs from "fs";
import https from "https";
import sizeOf from "image-size";
import path from "path";

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const dataChunks = [];
        response.on("data", (chunk) => dataChunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(dataChunks)));
      })
      .on("error", reject);
  });
}

async function replaceImageTags(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const regex =
    /!\[([^\]]*)\]\(([^)]+)\)|\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g;
  let match;
  const fileDir = path.dirname(filePath);
  while ((match = regex.exec(content)) !== null) {
    const alt = match[1] || match[3];
    let imagePath = match[2] || match[4];
    const href = match[5];
    let dimensions;

    if (imagePath.startsWith("http")) {
      const imageBuffer = await downloadImage(imagePath);
      dimensions = sizeOf(imageBuffer);
    } else {
      const absoluteImagePath = path.resolve(fileDir, imagePath);
      dimensions = sizeOf(absoluteImagePath);
    }

    const imageTag = `<Image
      src="${imagePath}"
      width={${dimensions.width}}
      height={${dimensions.height}}
      layout="constrained"
      alt="${alt}"
      ${href ? `href="${href}"` : ""}
    />`;
    content = content.replace(match[0], imageTag);
  }
  fs.writeFileSync(filePath, content);
}

const filePath =
  "../../apps/docs/src/routes/(ja)/blog/contents/2023_furikaeri/index.mdx";
replaceImageTags(filePath);
