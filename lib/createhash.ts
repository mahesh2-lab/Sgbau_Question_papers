import crypto from "crypto";
import fs from "fs";



export function getFileHash(filePath: fs.PathOrFileDescriptor) {
  const fileBuffer = fs.readFileSync(filePath); // Load entire file into memory
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

