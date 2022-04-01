import { encrypt, decrypt, PrivateKey } from 'eciesjs';

export const privateKey = () => {
  return PrivateKey.fromHex(
    '0x2a1d5d208b3d551e8662bcf4bd12e66ab4e025ec8ef6e18cbc40c1594794652f'
  );
};

export const encryptMsg = (message: string, privKey: PrivateKey) => {
  const data = Buffer.from(message);
  return encrypt(
    '024dc4941523c2a0af57528d18a86c35ad24d3e5966788e1807ffd83391a5f6668',
    data
  );
};

export const decryptMsg = (cipher: any, privKey: PrivateKey) => {
  return decrypt(privKey.toHex(), cipher).toString();
};
