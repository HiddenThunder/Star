import { encrypt, decrypt, PrivateKey } from 'eciesjs';

export const privateKey = () => {
  return PrivateKey.fromHex(
    '0x2a1d5d208b3d551e8662bcf4bd12e66ab4e025ec8ef6e18cbc40c1594794652f'
  );
};

export const encryptMsg = (privKey: string, message: string) => {
  const data = Buffer.from(message);
  const publicKey = PrivateKey.fromHex(privKey).publicKey.toHex();
  return encrypt(publicKey, data);
};

export const decryptMsg = (cipher: any, privKey: string) => {
  return decrypt(privKey, cipher).toString();
};
