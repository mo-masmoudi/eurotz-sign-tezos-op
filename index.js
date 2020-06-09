const axios = require("axios");
const blake = require("blakejs");
const bs58check = require("bs58check");

const conf = require("./conf");
const signOpDetached = require("./signOpOffline.minified");

const prefix = {
  edsk: new Uint8Array([43, 246, 78, 7]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  expr: new Uint8Array([13, 44, 64, 27]),
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

function encodeExpr(value) {
  const blakeHash = blake.blake2b(hex2buf(value), null, 32);

  const encodedKey = b58encode(blakeHash, prefix.expr);
  return encodedKey;
}

// ============================================================

async function getBalance(address) {
  try {
    const packedData = await axios.post(
      `${conf.remoteNodeRPC}/chains/main/blocks/head/helpers/scripts/pack_data`,
      {
        data: { string: address },
        type: { prim: "address" },
        gas: "800000",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const expr = encodeExpr(packedData.data.packed);
    let userBalance;

    try {
      const value = await axios.get(
        `${conf.remoteNodeRPC}/chains/main/blocks/head/context/big_maps/${conf.bigMapId}/${expr}`
      );
      userBalance = parseInt(value.data.args[1].args[0].int, 10);
    } catch (e) {
      if (e.response.status === 404 && e.response.statusText === "Not Found") {
        userBalance = 0;
      } else {
        throw e;
      }
    }

    return userBalance;
  } catch (e) {
    throw e;
  }
}

// ============================================================

// ============================================================

async function getNonce(address) {
  try {
    const packedData = await axios.post(
      `${conf.remoteNodeRPC}/chains/main/blocks/head/helpers/scripts/pack_data`,
      {
        data: { string: address },
        type: { prim: "address" },
        gas: "800000",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const expr = encodeExpr(packedData.data.packed);

    let userNonce;

    try {
      const value = await axios.get(
        `${conf.remoteNodeRPC}/chains/main/blocks/head/context/big_maps/${conf.bigMapId}/${expr}`
      );
      userNonce = parseInt(value.data.args[1].args[1].int, 10);
    } catch (e) {
      if (e.response.status === 404 && e.response.statusText === "Not Found") {
        userNonce = 0;
      } else {
        throw e;
      }
    }

    return userNonce;
  } catch (e) {
    throw e;
  }
}

// ============================================================

// ============================================================

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

// ============================================================

// === Exports

module.exports = sign;
module.exports = getBalance;
module.exports = getNonce;
