const fs = require("fs");
// 1. hook load fix
let h = fs.readFileSync("src/hooks/usePaymentLinks.ts","utf8");
h = h.replace("    return parsed.map((l) => ({ allowPartial: false, amountPaid: l.status === 'Paid' ? l.amount : (l.amountPaid ?? 0), ...l }));",
"    return parsed.map((l) => { const r = l as unknown as Record<string, unknown>; const amount = typeof r.amount === 'number' ? r.amount : 0; const st = r.status === 'Paid' ? 'Paid' as const : 'Active' as const; return { id: String(r.id ?? ''), amount, description: String(r.description ?? ''), customerEmail: typeof r.customerEmail === 'string' ? r.customerEmail : undefined, customerPhone: typeof r.customerPhone === 'string' ? r.customerPhone : undefined, status: st, paymentUrl: String(r.paymentUrl ?? ''), createdAt: String(r.createdAt ?? new Date().toISOString()), expiryDate: typeof r.expiryDate === 'string' ? r.expiryDate : null, allowPartial: r.allowPartial === true, minFirstPayment: typeof r.minFirstPayment === 'number' ? r.minFirstPayment : undefined, amountPaid: typeof r.amountPaid === 'number' ? r.amountPaid : (st === 'Paid' ? amount : 0) } as PaymentLink; });");
fs.writeFileSync("src/hooks/usePaymentLinks.ts", h);
// 2. validation.test old calls: add new fields
let vt = fs.readFileSync("src/utils/validation.test.ts","utf8");
vt = vt.split("      expiryDate: '',\n    });").join("      expiryDate: '',\n      allowPartial: false,\n      minFirstPayment: '',\n    });");
fs.writeFileSync("src/utils/validation.test.ts", vt);
// 3. status test: annotate partial objects as PaymentLink
let t = fs.readFileSync("src/utils/paymentStatus.test.ts","utf8");
t = t.replace("const base2 = { id: 'p1', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: null, allowPartial: true, minFirstPayment: 100, amountPaid: 0 };",
"const base2: PaymentLink = { id: 'p1', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: null, allowPartial: true, minFirstPayment: 100, amountPaid: 0 };");
t = t.replace("const part = { id: 'p2', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: past, allowPartial: true, amountPaid: 200 };",
"const part: PaymentLink = { id: 'p2', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: past, allowPartial: true, amountPaid: 200 };");
t = t.replace("const paidPast = { ...part, amountPaid: 1000 };", "const paidPast: PaymentLink = { ...part, amountPaid: 1000 };");
fs.writeFileSync("src/utils/paymentStatus.test.ts", t);
console.log("ts fixes done");
