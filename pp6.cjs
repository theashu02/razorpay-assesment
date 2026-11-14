const fs = require("fs");
let t = fs.readFileSync("src/utils/paymentStatus.test.ts","utf8");
t = t.split("await import(\'../paymentStatus\')").join("await import(\'./paymentStatus\')");
t = t.split("await import(\"../paymentStatus\")").join("await import(\"./paymentStatus\")");
fs.writeFileSync("src/utils/paymentStatus.test.ts", t);
console.log("import fixed");
