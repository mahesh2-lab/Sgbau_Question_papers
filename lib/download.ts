import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

/**
 * Downloads a file from a URL and saves it to the given local path
 * @param fileUrl - The URL of the file to download
 * @param savePath - Local path where the file should be saved
 * @returns Promise<{ success: boolean; message: string; path?: string; response?: any }>
 */
export async function downloadFile(
  fileUrl: string,
  savePath: string
): Promise<{ success: boolean; message: string; path?: string; response?: any }> {
  return new Promise((resolve) => {
    try {
      fs.mkdirSync(path.dirname(savePath), { recursive: true });
    } catch (err) {
      resolve({
        success: false,
        message: "Failed to create directory.",
        response: err,
      });
      return;
    }

    const client = fileUrl.startsWith("https") ? https : http;
    const file = fs.createWriteStream(savePath);

    console.log(`Downloading file from ${fileUrl} to ${savePath}`);

    client
      .get(fileUrl, (response) => {
        if (response.statusCode !== 200) {
          resolve({
            success: false,
            message: "Code is invalid",
            response,
          });
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve({
            success: true,
            message: "Download finished",
            path: savePath,
            response,
          });
        });
      })
      .on("error", (err) => {
        fs.unlink(savePath, () => {
          resolve({
            success: false,
            message: "Code is invalid",
            response: err,
          });
        });
      });
  });
}
