const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/Expresserror.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const{validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js")


//Post reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.cretaereview));
   
   //delete review Route
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deletereview));

   module.exports=router;