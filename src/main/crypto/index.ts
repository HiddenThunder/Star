import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';
import { ecdh } from 'secp256k1';

//* ENCODING IS IMPORTANT
/*  USE HEX HERE EVERYWHERE WHERE POSSIBLE
/*  https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
 */

String.prototype.hexEncode = function () {
  var hex, i;

  var result = '';
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
};

String.prototype.hexDecode = function () {
  var j;
  var hexes = this.match(/.{1,4}/g) || [];
  var back = '';
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};

export const privateKey = (hex: string) => {
  console.log(hex);
  return PrivateKey.fromHex(hex);
};

export const generatePrivateKey = () => {
  return new PrivateKey();
};

export const encryptMsg = (privKey: string, message: string) => {
  //* ENCODING IS IMPORTANT
  /*  USE HEX HERE EVERYWHERE WHERE POSSIBLE
   */
  const data = Buffer.from(message.hexEncode(), 'hex');
  const publicKey = PrivateKey.fromHex(privKey).publicKey.toHex();
  const encrypted = encrypt(publicKey, data);
  return encrypted;
};

export const decryptMsg = (cipher: any, privKey: string) => {
  const decrypted = decrypt(privKey, Buffer.from(cipher, 'hex')).toString();
  return decrypted;
};

export const generateSharedSecret = (privateKey: string, publicKey: string) => {
  const PrivKey = PrivateKey.fromHex(privateKey);
  const PubKey = PublicKey.fromHex(publicKey);
  const secret = PrivKey.multiply(PubKey);

  return `0x${secret.slice(0, 32).toString('hex')}`;
};
