const { getUser, isAdmin } = require('./_lib');
module.exports = (req, res) => { const u = getUser(req);
  res.json(u ? { email: u.e, name: u.n, admin: isAdmin(u) } : { email: null });
};
