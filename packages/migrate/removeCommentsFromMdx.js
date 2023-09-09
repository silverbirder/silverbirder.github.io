const fs = require("fs");
const path = require("path");

const directoryPath = "../docs/src/routes/blog/contents";

// Function to remove comments from a string
function removeComments(str) {
  return str.replace(/<!--[\s\S]*?-->/g, "");
}

// Function to process each file
function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const newData = removeComments(data);

    fs.writeFile(filePath, newData, "utf8", (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }

      console.log(`Processed file: ${filePath}`);
    });
  });
}

// Function to process each directory
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

// Start processing
processDirectory(directoryPath);
