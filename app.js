
if (process.env.NODE_ENV !== "production") { 
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Expresserror = require("./utils/Expresserror.js");
const { listingSchema,reviewSchema } = require("./Schemavalidate.js");
const Review=require("./models/review.js");
const Session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");

// Middleware Setup
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const dbUrl=process.env.ATLAS_URL;
async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to the database.");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store");
})
const SessionOption = {
    store,
    secret:process.env.SECRET , resave: false, 
    saveUninitialized: true,
cookie:{
    expires: Date.now()+7 * 24 * 60 * 60 * 1000,
    maxAge: Date.now()+7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
} };


app.use(Session(SessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database Connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";




//listing express route
    app.use("/listings",listingsRouter);

//review express router
app.use("/listings/:id/reviews",reviewsRouter);

//user Router
app.use("/",userRouter);



// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.error(err.stack); // Log stack trace for debugging
    res.status(statusCode).render("error.ejs", { statusCode, message });
});


// Start Server
app.listen(8080, () => {
    console.log("Listening on port 8080.");
});



