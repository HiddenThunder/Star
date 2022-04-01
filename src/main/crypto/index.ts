import { encrypt, decrypt, PrivateKey } from 'eciesjs';

export const privateKey = new PrivateKey();

export const encryptMsg = (message: string, privKey: PrivateKey) => {
  const data = Buffer.from(message);
  return encrypt(privateKey.publicKey.toHex(), data);
};

export const decryptMsg = (cipher: any, privKey: PrivateKey) => {
  return decrypt(privKey.toHex(), cipher).toString();
};
