const fs = require("fs");
let t = fs.readFileSync("src/utils/paymentStatus.test.ts","utf8");
t = t.replace("  expiryDate: null,\n};", "  expiryDate: null,\n  allowPartial: false,\n  amountPaid: 0,\n};");
fs.writeFileSync("src/utils/paymentStatus.test.ts", t);
console.log("base fixed");
