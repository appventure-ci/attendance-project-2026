const L = require('./_lib');
module.exports = async (req, res) => {
  const u = L.getUser(req); if (!L.isAdmin(u)) return res.status(401).json({ error: 'auth' });
  const now = Date.now(), w8 = Math.floor(now / L.W_QR), w4 = Math.floor(now / L.W_LET);
  const since = +req.query.since || 0, all = await L.r('HGETALL', 'att:' + L.dayKey());
  const events = [];
  for (let i = 0; i < (all || []).length; i += 2) { const v = JSON.parse(all[i + 1]); if (v.ts > since) events.push({ email: all[i], name: v.name, ts: v.ts }); }
  res.json({ url: `${L.BASE()}/s?t=${L.qrToken(w8)}`, letters: L.letters(w4),
    qrMsLeft: (w8 + 1) * L.W_QR - now, letMsLeft: (w4 + 1) * L.W_LET - now, now, events, count: (all || []).length / 2 });
};
