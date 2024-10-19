import fs from "fs";
import path from "path";
import sharp from "sharp";

export const getPngFilesWithSize = async () => {
  try {
    // フォルダ内の全ファイル名を取得
    const directoryPath = path.join(process.cwd(), "public", "my-photo");
    const files = fs.readdirSync(directoryPath);

    // PNG ファイルのみを対象に処理
    const pngFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".png"
    );

    const fileInfoPromises = pngFiles.map(async (file) => {
      // フルパスを作成して sharp に渡す
      const filePath = path.join(directoryPath, file);
      // sharp で画像のメタデータ（サイズ）を取得
      const metadata = await sharp(filePath).metadata();

      return {
        src: `/my-photo/${file}`,
        width: metadata.width,
        height: metadata.height,
      };
    });

    // 全てのプロミスが解決されるのを待つ
    const fileInfo = await Promise.all(fileInfoPromises);

    return fileInfo;
  } catch (error) {
    console.error("Error reading files or getting metadata:", error);
  }
};
