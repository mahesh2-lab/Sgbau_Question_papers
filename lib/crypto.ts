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
  "https://migration-contents.classx.co.in/production/single/akmxm/d871a18f-97ce-4854-a872-270a777932db.pdf";
const salt = "maheshchopade133";


const encrypted = encryptText(text, salt);
console.log(encrypted);

const decrypted = decryptText(encrypted, salt);
console.log(decrypted);