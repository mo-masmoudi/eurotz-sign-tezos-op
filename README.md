### Install

`npm i eurotz-sign`

### Sign

```
const sign = require("eurotz-sign");

const opBytes =
  "050707001807070509000a070700b2e10107070a00000016000085ef0c18b31983603d978a152de4cd61803db8810a0000001601e7e82a3798c9ffb74841ff93b77f3239f63db74100";
const secretKey =
  "edskRj834H7r8xqHcYFimxReFdSfhsb2eGxJAUuvvb8jnfpP2j7bKTDRaYVyfGRsmkW8RjChhQSYx1EMSg4CiAzhtgHwF6HdHE";

const signature = sign(opBytes, secretKey);

console.log("OP SIGNATURE: ", signature);
```