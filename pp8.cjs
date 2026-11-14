const fs = require("fs");
let t = fs.readFileSync("src/utils/paymentStatus.test.ts","utf8");
t = t.split("  expiryDate: null,\n};").join("  expiryDate: null,\n  allowPartial: false,\n  amountPaid: 0,\n};");
fs.writeFileSync("src/utils/paymentStatus.test.ts", t);
let vt = fs.readFileSync("src/utils/validation.test.ts","utf8");
vt = vt.split("      expiryDate: '',\n    });").join("      expiryDate: '',\n      allowPartial: false,\n      minFirstPayment: '',\n    });");
fs.writeFileSync("src/utils/validation.test.ts", vt);
console.log("replace-all done");
