import fs from "fs";
import pdf from "pdf-parse";

export async function getPdfPageCount(filePath: string) {
  const data = await pdf(fs.readFileSync(filePath));
  return data.numpages;
}

