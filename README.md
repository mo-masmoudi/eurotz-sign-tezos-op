### Install

`npm i eurotz-sign`

### Sign & Get details

#### Example

```
const euroTz = require("eurotz-sign");

async function runScripts() {
  const senderAddress = "tz1XrCvviH8CqoHMSKpKuznLArEa1yR9U7ep";
  const receiverAddress = "tz1XvMBRHwmXtXS2K6XYZdmcc5kdwB9STFJu";
  const senderSecretKey =
    "edskRt2ibNbv4BNrn7FRXuYTwGF54oVAe8JuUuE8YVsvnc78GwpRvYk9ftmQKxQjeczGZwacGSdHWWXrLDWcYoq3EhiY5TuUtU";
  const amount = 43;
  const contractAddress = "KT1GVGz2YwuscuN1MEtocf45Su4xomQj1K8z";

  const senderNonce = await euroTz.getNonce(senderAddress);
  const senderBalance = await euroTz.getEuroTzBalance(senderAddress);

  const opBytes = await euroTz.pack(
    amount,
    senderNonce,
    senderAddress,
    receiverAddress,
    contractAddress
  );
  const opSignature = euroTz.sign(opBytes, senderSecretKey);

  console.log("Sender Nonce: ", senderNonce);
  console.log("Sender Balance: ", senderBalance);
  console.log("Op Bytes: ", opBytes);
  console.log("Op Signature: ", opSignature);
}

runScripts();

```

#### Run Examlpe

`cd eurotz-sign`

`node ./index.js`
