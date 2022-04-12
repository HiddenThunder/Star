import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';

/** Encoding is important
/*  Use hex here everywhere where possible
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

//* Generates private key object from given hex
export const privateKey = (hex: string) => {
  return PrivateKey.fromHex(hex);
};

// Generates random private key object
export const generatePrivateKey = () => {
  return new PrivateKey();
};

// Encrypt string and return it as hex
export const encryptMsg = (privKey: string, message: string) => {
  /** Encoding is important
  /*  Use hex here everywhere where possible
   */
  const data = Buffer.from(message.hexEncode(), 'hex');
  const publicKey = PrivateKey.fromHex(privKey).publicKey.toHex();

  // Encrypt with public key
  const encrypted = encrypt(publicKey, data);
  return encrypted;
};

// Decrypt to hex and convert to utf-8
export const decryptMsg = (cipher: any, privKey: string) => {
  // And then decrypt with private key
  const decrypted = decrypt(privKey, Buffer.from(cipher, 'hex')).toString();
  return decrypted;
};

// Generate shared secret for private chat
export const generateSharedSecret = (privKey: string, publicKey: string) => {
  const PrivKey = PrivateKey.fromHex(privKey);
  const PubKey = PublicKey.fromHex(publicKey);
  // ECDH
  const secret = PrivKey.multiply(PubKey);

  /** We take only x coordinate (or y, I don't actually know)
   * we take first 32 bytes
   */
  return `0x${secret.slice(0, 32).toString('hex')}`;
};
