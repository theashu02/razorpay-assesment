const fs = require("fs");
// patch status test counts
let t = fs.readFileSync("src/utils/paymentStatus.test.ts","utf8");
t = t.replace("expect(getStatusCounts(links, now)).toEqual({ total: 3, active: 1, paid: 1, expired: 1 });", "expect(getStatusCounts(links, now)).toEqual({ total: 3, active: 1, partially: 0, paid: 1, expired: 1 });");
if (!t.includes("Partially paid")) {
  t += `
describe('partial payments', () => {
  it('marks partially paid and full paid', async () => {
    const m = await import('../paymentStatus');
    const base2 = { id: 'p1', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: null, allowPartial: true, minFirstPayment: 100, amountPaid: 0 };
    expect(m.getEffectiveStatus(base2)).toBe('Active');
    expect(m.getEffectiveStatus({ ...base2, amountPaid: 400 })).toBe('Partially paid');
    expect(m.getEffectiveStatus({ ...base2, amountPaid: 1000 })).toBe('Paid');
    expect(m.amountDue({ ...base2, amountPaid: 400 })).toBe(600);
  });
  it('expired wins over partial, paid never expires', async () => {
    const m = await import('../paymentStatus');
    const past = new Date(Date.now() - 1000).toISOString();
    const part = { id: 'p2', amount: 1000, description: 'd', status: 'Active', paymentUrl: 'u', createdAt: new Date().toISOString(), expiryDate: past, allowPartial: true, amountPaid: 200 };
    expect(m.getEffectiveStatus(part)).toBe('Expired');
    const paidPast = { ...part, amountPaid: 1000 };
    expect(m.getEffectiveStatus(paidPast)).toBe('Paid');
  });
});
`;
  fs.writeFileSync("src/utils/paymentStatus.test.ts", t);
}
let vt = fs.readFileSync("src/utils/validation.test.ts","utf8");
if (!vt.includes("minFirstPayment")) {
  vt += `
describe('partial payment validation', () => {
  it('requires min first payment when allowed', async () => {
    const m = await import('./validation');
    expect(m.validateMinFirstPayment('', '1000', true)).toContain('required');
    expect(m.validateMinFirstPayment('0', '1000', true)).toContain('greater than zero');
    expect(m.validateMinFirstPayment('1500', '1000', true)).toContain('cannot exceed');
    expect(m.validateMinFirstPayment('500', '1000', true)).toBeUndefined();
    expect(m.validateMinFirstPayment('', '1000', false)).toBeUndefined();
    expect(m.validateRecordPayment('0', 500)).toContain('greater than zero');
    expect(m.validateRecordPayment('600', 500)).toContain('cannot exceed due');
    expect(m.validateRecordPayment('200', 500)).toBeUndefined();
  });
});
`;
  fs.writeFileSync("src/utils/validation.test.ts", vt);
}
console.log("tests patched");
