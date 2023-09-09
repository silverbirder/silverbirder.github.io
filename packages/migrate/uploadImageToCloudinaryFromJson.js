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

const filePath = "../docs/src/routes/resume/index.json";
const folderPath = "silver-birder.github.io/resume";
const dryRun = false;
let processLimit = 50;
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

const processJson = async () => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);

  if (!data.items) {
    console.log(`No "items" found in the JSON file: ${filePath}`);
    return;
  }

  let updatedItems = [...data.items];

  for (let item of updatedItems) {
    if (item.image && processLimit > 0) {
      const imageUrl = item.image;

      if (imageUrl.includes("res.cloudinary.com")) continue;

      if (dryRun) {
        console.log(`File: ${filePath} - Image URL: ${imageUrl}`);
      } else {
        try {
          const { newUrl, imageName } = await uploadToCloudinary(imageUrl);
          item.image = newUrl;
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
  }

  if (!dryRun) {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ items: updatedItems }, null, 2),
      "utf-8"
    );
  }
};

processJson()
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
