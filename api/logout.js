const { setCookie } = require('./_lib');
module.exports = (req, res) => { setCookie(res, 'sess', '', 0); res.redirect(302, '/'); };
