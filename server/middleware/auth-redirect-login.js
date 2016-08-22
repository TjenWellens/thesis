module.exports = function redirect (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/signup');
  next();
}
