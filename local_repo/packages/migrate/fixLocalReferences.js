const fs = require("fs");
const path = require("path");

const directoryPath = "../docs/src/routes/blog/contents"; // Updated path

function fixLocalFileReferences(str) {
  return str.replace(/\.\/([a-zA-Z0-9_-]+)\.md/g, "../$1/index.md"); // Updated to .mdx
}

function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const newData = fixLocalFileReferences(data);

    fs.writeFile(filePath, newData, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }

      console.log(`Processed file: ${filePath}`);
    });
  });
}

function processDirectory(directoryPath) {
  fs.readdir(directoryPath, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    dirents.forEach((dirent) => {
      const fullPath = path.join(directoryPath, dirent.name);
      if (dirent.isDirectory()) {
        processDirectory(fullPath);
      } else if (dirent.isFile() && path.extname(dirent.name) === ".md") {
        processFile(fullPath);
      }
    });
  });
}

processDirectory(directoryPath);
