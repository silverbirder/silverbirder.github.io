import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";

async function getImageSize(uploadResult) {
  return {
    width: uploadResult.width,
    height: uploadResult.height,
  };
}

async function uploadImage(localPath) {
  const folder = process.env.CLOUDINARY_FOLDER;
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
  });
  return result;
}

async function processFile(filePath) {
  let content = await fs.readFile(filePath, "utf-8");
  const regex = /!\[([^\]]*)\]\((\.\/[^\)]+)\)/g;
  let match;
  let replaced = false;

  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, alt, imgPath] = match;
    const absImgPath = path.resolve(path.dirname(filePath), imgPath);
    const uploadRes = await uploadImage(absImgPath);
    const { width, height } = await getImageSize(uploadRes);
    const imageTag = `<Image
  src="${uploadRes.secure_url}"
  alt="${alt}"
  height={${height}}
  width={${width}}
/>`;
    content = content.replace(fullMatch, imageTag);
    replaced = true;
  }

  if (replaced) {
    await fs.writeFile(filePath, content, "utf-8");
    console.log(`Updated: ${filePath}`);
  }
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/upload-images.mjs <filePath>");
    process.exit(1);
  }
  await processFile(filePath);
}

main();
