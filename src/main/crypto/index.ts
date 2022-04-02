import { encrypt, decrypt, PrivateKey } from 'eciesjs';

//* ENCODING IS IMPORTANT
/*  USE HEX HERE EVERYWHERE WHERE POSSIBLE
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
  return PrivateKey.fromHex(hex);
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
