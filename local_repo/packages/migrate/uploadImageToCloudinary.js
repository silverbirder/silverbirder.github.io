const fs = require("fs");
const path = require("path");
const url = require("url");
const crypto = require("crypto");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "silverbirder",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const directoryPath = "../docs/src/routes/blog/contents";
const folderPath = "silver-birder.github.io/blog";
const dryRun = false;
let processLimit = 5;
const MAX_PUBLIC_ID_LENGTH = 200;

const generateImageName = (imageUrl) => {
  const parsedUrl = url.parse(imageUrl);
  const baseNameWithoutExtension = path.basename(
    parsedUrl.pathname,
    path.extname(parsedUrl.pathname)
  );

  const fullImageName = `${baseNameWithoutExtension}`;

  if (fullImageName.length > MAX_PUBLIC_ID_LENGTH) {
    const hash = crypto.createHash("sha256").update(imageUrl).digest("hex");
    return `${hash}`;
  }

  return fullImageName;
};

const uploadToCloudinary = async (imageUrl) => {
  const imageName = generateImageName(imageUrl);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      { folder: folderPath, public_id: imageName },
      (error, result) => {
        if (error) reject(error);
        else resolve({ newUrl: result.secure_url, imageName: imageName });
      }
    );
  });
};

const processFiles = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      await processFiles(filePath);
    } else if (path.extname(filePath) === ".mdx") {
      let content = fs.readFileSync(filePath, "utf-8");
      const imageRegex = /<Image[^>]*src="([^"]+)"[^>]*\/>/g;

      let updatedContent = content;
      let match;
      while ((match = imageRegex.exec(content)) && processLimit > 0) {
        const imageUrl = match[1];

        if (imageUrl.includes("res.cloudinary.com")) continue;

        if (dryRun) {
          console.log(`File: ${filePath} - Image URL: ${imageUrl}`);
        } else {
          try {
            const { newUrl, imageName } = await uploadToCloudinary(imageUrl);
            updatedContent = updatedContent.replace(imageUrl, newUrl);
            console.log(
              `File: ${filePath} - Uploaded Image: ${imageName} - New URL: ${newUrl}`
            );
          } catch (error) {
            console.error(
              `Failed to upload image from URL ${imageUrl} in file ${filePath} due to error:`,
              error
            );
          } finally {
            processLimit--;
          }
        }
      }

      if (!dryRun && content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, "utf-8");
      }
    }
  }
};

processFiles(directoryPath)
  .then(() => {
    if (dryRun) {
      console.log("Dry run completed. No images were uploaded.");
    } else {
      console.log("Image URLs processed and updated!");
    }
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
