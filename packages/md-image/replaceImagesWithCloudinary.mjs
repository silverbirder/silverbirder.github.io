import fs from "fs";
import https from "https";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: "silverbirder",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

async function uploadToCloudinary(imagePath) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(imagePath, (error, result) => {
      if (error) reject(error);
      else resolve(result.url);
    });
  });
}

async function replaceImageTags(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const regex = /<Image\s+src="([^"]+)"\s+[^>]*>/g;
  let match;
  const fileDir = path.dirname(filePath);
  while ((match = regex.exec(content)) !== null) {
    const oldUrl = match[1];
    if (!oldUrl.includes("res.cloudinary.com")) {
      let newUrl;
      if (oldUrl.startsWith("http")) {
        const imageBuffer = await downloadImage(oldUrl);
        const tempPath = "/tmp/temp_image.jpg"; // 一時ファイルのパス
        fs.writeFileSync(tempPath, imageBuffer);
        newUrl = await uploadToCloudinary(tempPath);
      } else {
        const absoluteImagePath = path.resolve(fileDir, oldUrl);
        newUrl = await uploadToCloudinary(absoluteImagePath);
      }
      content = content.replace(oldUrl, newUrl);
    }
  }
  fs.writeFileSync(filePath, content);
}

const filePath =
  "../../apps/docs/src/routes/(ja)/blog/contents/2023_furikaeri/index.mdx";
replaceImageTags(filePath);
