module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
     if(req.user.required == "Student"){
      res.redirect('/dashboard');      }
      else if(req.user.required == "Driver"){
        res.redirect('/dashboarddriver'); 
      }
    }
  };