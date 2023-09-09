const fs = require("fs");
const path = require("path");

const changeFileExtensions = (dir, fromExt, toExt) => {
  // 指定されたディレクトリ内のすべてのファイルとディレクトリを取得
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      // ファイルかどうかを確認
      if (
        fs.statSync(filePath).isFile() &&
        path.extname(filePath) === fromExt
      ) {
        const newPath = path.join(dir, path.basename(file, fromExt) + toExt);
        fs.rename(filePath, newPath, (err) => {
          if (err) {
            console.error(`Error renaming file ${filePath}:`, err);
            return;
          }
          console.log(`Renamed ${filePath} to ${newPath}`);
        });
      } else if (fs.statSync(filePath).isDirectory()) {
        // ディレクトリの場合、再帰的に関数を呼び出す
        changeFileExtensions(filePath, fromExt, toExt);
      }
    });
  });
};

const directoryPath = "../docs/src/routes/blog/contents";
changeFileExtensions(directoryPath, ".md", ".mdx");
