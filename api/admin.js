const L = require('./_lib');
module.exports = async (req, res) => {
  const u = L.getUser(req); if (!L.isAdmin(u)) return res.status(401).json({ error: 'auth' });
  if (req.method === 'POST') {
    const b = await L.body(req), clean = (a) => [...new Set((a || []).map((s) => String(s).trim().toLowerCase()).filter(Boolean))];
    if (b.students) await L.r('SET', 'cfg:students', JSON.stringify(clean(b.students)));
    if (b.ips) await L.r('SET', 'cfg:ips', JSON.stringify(clean(b.ips)));
    return res.json({ ok: true });
  }
  const day = String(req.query.date || L.dayKey());
  const all = (await L.r('HGETALL', 'att:' + day)) || [], logs = [];
  for (let i = 0; i < all.length; i += 2) logs.push({ email: all[i], ...JSON.parse(all[i + 1]) });
  logs.sort((a, b) => a.ts - b.ts);
  const students = await L.getJson('cfg:students', []), seen = new Set(logs.map((l) => l.email));
  res.json({ day, logs, absent: students.filter((s) => !seen.has(s)), students, ips: await L.getJson('cfg:ips', []), myIp: L.clientIp(req) });
};
