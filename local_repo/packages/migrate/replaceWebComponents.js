const fs = require("fs");
const path = require("path");

const directoryPath = "../docs/src/routes/blog/contents";

function replaceWebComponents(str) {
  // Replace <o-embed> with the URL
  str = str.replace(/<?<o-embed src="([^"]+)"[^>]*><\/o-embed>/g, "$1");

  // Replace <ogp-me> with the URL
  str = str.replace(/<ogp-me src="([^"]+)"[^>]*><\/ogp-me>/g, "$1");
  // TFypo
  str = str.replace(/<ogp-me src="([^"]+)"[^>]*><\/opg-me>/g, "$1");

  return str;
}

function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const newData = replaceWebComponents(data);

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
