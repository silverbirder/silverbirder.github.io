const fs = require("fs");
const path = require("path");

const sourceDir = "../../../silverbirder.github.io/docs/blog/contents";
const targetDir = "../docs/src/routes/blog/contents";

// Read all files from source directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error(`Error reading source directory: ${err}`);
    return;
  }

  // Filter only markdown files
  const markdownFiles = files.filter((file) => path.extname(file) === ".md");

  markdownFiles.forEach((file) => {
    const fileNameWithoutExt = path.basename(file, ".md");
    const sourceFilePath = path.join(sourceDir, file);
    const targetDirPath = path.join(targetDir, fileNameWithoutExt);
    const targetFilePath = path.join(targetDirPath, "index.md");

    // Create target directory if not exists
    fs.mkdir(targetDirPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating target directory: ${err}`);
        return;
      }

      // Rename (move) the file
      fs.rename(sourceFilePath, targetFilePath, (err) => {
        if (err) {
          console.error(`Error moving file: ${err}`);
          return;
        }

        console.log(`Moved ${sourceFilePath} to ${targetFilePath}`);
      });
    });
  });
});
