import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_SECRET_KEY;

export const decryptEnv = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  console.log(secretKey, decryptedText, "decryplksajf");
  return decryptedText;
};
