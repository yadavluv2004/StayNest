const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
    fieldSize: 20 * 1024 * 1024, // 20MB form field limit
  },
});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// New Listing  Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(
    wrapAsync(listingController.showlisting)
)
.put(
    isLoggedIn,isOwner,upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateform)
)
.delete(
    isLoggedIn,isOwner,
    wrapAsync(listingController.deletelisting)
);



// Edit Listing Form Route
router.get(
    "/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.rendereditform)
);




module.exports = router;

