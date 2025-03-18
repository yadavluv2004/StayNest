const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.cretaereview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
   newReview.author=req.user._id;
    await listing.reviews.push(newReview);
   
    await newReview.save();
   await listing.save();
   console.log(newReview);
   req.flash("success","New Review Added!");
   res.redirect(`/listings/${listing._id}`);
   }

   module.exports.deletereview=async (req, res) => {
          let { id, reviewId } = req.params;
      
          // Remove reference to review in Listing model
          await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      
          // Delete the actual review
          await Review.findByIdAndDelete(reviewId);
          req.flash("success","Review Deleted!");
          res.redirect(`/listings/${id}`);
      }