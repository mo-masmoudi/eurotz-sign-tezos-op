const blake = require("blakejs");
const bs58check = require("bs58check");

const signOpDetached = require("./signOpOffline.minified")

const prefix = {
  edsk: new Uint8Array([43, 246, 78, 7]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
};

function hex2buf(hex) {
  return new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );
}

function b58encode(payload, prefix) {
  const n = new Uint8Array(prefix.length + payload.length);
  n.set(prefix);
  n.set(payload, prefix.length);
  return bs58check.encode(Buffer.from(n, "hex"));
}

function b58decode(enc, prefix) {
  return bs58check.decode(enc).slice(prefix.length);
}

function sign(bytes, secretKey) {
  const bytesByffer = hex2buf(bytes);
  const genericHash = blake.blake2b(bytesByffer, null, 32);
  const sigUint8Array = signOpDetached(
    genericHash,
    b58decode(secretKey, prefix.edsk)
  );

  const opSign = b58encode(sigUint8Array, prefix.edsig);

  return opSign;
}

module.exports = sign;
