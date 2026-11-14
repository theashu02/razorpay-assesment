const fs = require("fs");
let f = fs.readFileSync("src/components/PaymentLinkForm.tsx","utf8");
f = f.split("console.log(\"[form-submit] attempt \" + JSON.stringify(form)); ").join("");
f = f.split(" { console.log(\"[form-submit] blocked \" + JSON.stringify(validation)); return; } console.log(\"[form-submit] ok\");").join("");
if (!f.includes("if (Object.keys(validation).length > 0) return;")) {
  f = f.replace(/if \(Object\.keys\(validation\)\.length > 0\)[^\n]*\n/, "if (Object.keys(validation).length > 0) return;\n");
}
fs.writeFileSync("src/components/PaymentLinkForm.tsx", f);
console.log("debug logs removed");
let a = fs.readFileSync("src/App.tsx","utf8");
if (!a.includes("scroll-mt-")) {
  a = a.replace("<div ref={formRef}>", "<div ref={formRef} className=\"scroll-mt-20\">");
  fs.writeFileSync("src/App.tsx", a);
  console.log("scroll-margin added");
}
