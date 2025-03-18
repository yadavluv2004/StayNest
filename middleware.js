const Listing = require("./models/listing");
const Review=require("./models/review.js");
const { listingSchema,reviewSchema  } = require("./Schemavalidate.js");
const Expresserror = require("./utils/Expresserror.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "User must be logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {  
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; 
    } else {
        res.locals.redirectUrl = "/listings"; 
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Ensure user is logged in
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }

    // Check if the logged-in user is the owner of the listing
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "User Not Authorized");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Expresserror(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new Expresserror(400, error.details.map((e) => e.message).join(", "));
    } else {
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Not Authorized to delete");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
  