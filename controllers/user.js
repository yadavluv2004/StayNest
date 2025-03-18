const User=require("../models/user")
module.exports.rendersingup= (req, res) => {
    res.render("users/signup.ejs");
  }

  module.exports.signupuser=async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to the Site!!");
        return res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.loginUser=(req, res) => {
    req.flash("success", "Welcome Back!!!!");
    res.redirect(res.locals.redirectUrl); // Use fallback if undefined
  }

  module.exports.logoutuser= (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Successfully logged out");
      res.redirect("/listings");
    });
  }