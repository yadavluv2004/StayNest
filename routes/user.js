const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js"); // Ensure correct import
const userContrller=require("../controllers/user.js")


router.route("/signup")
.get(userContrller.rendersingup)
.post( wrapAsync(userContrller.signupuser));

router.route("/login")
.get(userContrller.renderLogin)
.post(
  saveRedirectUrl, // Middleware to store redirect URL
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userContrller.loginUser
);

router.get("/logout",userContrller.logoutuser);

module.exports = router;
