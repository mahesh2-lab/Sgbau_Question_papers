import CryptoJS from "crypto-js";

export function encryptText(text: string, salt: string) {
  const encrypted = CryptoJS.AES.encrypt(text, salt).toString();
  return encrypted;
}

export function decryptText(encryptedText: string, salt: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, salt);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

const text =
  "https://appx-content-v2.classx.co.in/paid_course4/2025-04-08-0.870815859744646.pdf";
const salt = "maheshchopade133";


const encrypted = encryptText(text, salt);
console.log(encrypted);

const decrypted = decryptText(encrypted, salt);
console.log(decrypted);