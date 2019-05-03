


/* GET users listing. */
router.get('/auth', ensureAuthenticated, function(req, res, next) {
    res.render('user', { user: req.user });
  });
  
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth')
  }