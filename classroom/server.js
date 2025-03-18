const express = require("express");
const app = express();
const expressSession = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
const sessionOptions = { secret: "thisisasecret", resave: false, saveUninitialized: true };
app.use(expressSession(sessionOptions));
app.use(flash());
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Register Route
app.get("/register", (req, res) => {
    let { name = "mota" } = req.query;
    req.session.name = name;
   
    if (name === "mota") {
        req.flash("error", "Not user registered");
    } else {
        req.flash("success", "User registered");
    }
    res.redirect("/hello");
});

// Hello Route
app.get("/hello", (req, res) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page", { name: req.session.name });
});

// Start Server
app.listen(3000, () => {
    console.log("Listening to port 3000");
});
