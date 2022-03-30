const assert = require('assert');
const { createECDH } = require('crypto');

// const { createECDH } = await import('crypto');

const genSharedSecret = () => {
  const me = createECDH('secp521r1');
  const myKe = me.generateKeys();

  const fren = createECDH('secp521r1');
  const frenKe = me.generateKeys();

  const mySecret = me.computeSecret(frenKe);
  const frenSecret = fren.computeSecret(myKe);

  assert.strictEqual(mySecret.toString('hex'), frenSecret.toString('hex'));

  return mySecret;
};

export default genSharedSecret;
