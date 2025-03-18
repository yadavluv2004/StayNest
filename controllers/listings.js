const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient =mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("./listings/index.ejs", { alllisting });
}


module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showlisting=async (req, res, next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    
        if (!listing) {
            req.flash("error", "No such Listing available");
            return res.redirect("/listings");  
        }
        console.log(listing);
        res.render("./listings/show.ejs", { listing });
    }

    module.exports.createListing = async (req, res, next) => {
        let response=await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
            .send();
           
        try {
            if (!req.body.listing) {
                req.flash("error", "Invalid listing data.");
                return res.redirect("/listings/new");
            }
    
            // Create a new listing with the form data
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
    
            // Ensure the file is uploaded before saving
            if (req.file) {
                newListing.image = { url: req.file.path, filename: req.file.filename };
            } else {
                req.flash("error", "Image upload failed.");
                return res.redirect("/listings/new");
            }

            newListing.geometry=response.body.features[0].geometry;
    
            // Save the new listing
            let saveListing=await newListing.save();
            console.log(saveListing); 
            req.flash("success", "New Listing added!");
            res.redirect(`/listings/${newListing._id}`);
        } catch (error) {
            console.error("Error in createListing:", error);
            req.flash("error", "Something went wrong while adding the listing.");
            res.redirect("/listings");
        }
    };

        module.exports.rendereditform=async (req, res, next) => {
                const { id } = req.params;
                const editlisting = await Listing.findById(id);
                if (!editlisting) {
                    req.flash("error", "No such Listing available for Editing");
                    return res.redirect("/listings");  // ✅ Fixed
                }
                let originalurl=editlisting.image.url;
                originalurl=originalurl.replace("/upload","/upload/h_300,w_2560");
                res.render("./listings/edit.ejs", { editlisting,originalurl });
        }

        module.exports.updateform = async (req, res) => {
            const { id } = req.params;
        
            // Find the listing first
            const updatedListing = await Listing.findById(id);
            if (!updatedListing) {
                throw new Expresserror(404, "Listing not found");
            }
        
            // Update other listing fields
            Object.assign(updatedListing, req.body.listing);
        
            // Handle image update if a new image URL is provided via form
            if (req.body.listing.image) {
                updatedListing.image = {
                    url: req.body.listing.image,
                    filename: "listingimage",
                };
            }
        
            // Handle image update if a new file is uploaded
            if (req.file) {
                updatedListing.image = {
                    url: req.file.path,  // Corrected URL assignment
                    filename: req.file.filename, // Corrected filename assignment
                };
            }
        
            // Save the updated listing
            await updatedListing.save();
        
            req.flash("success", "Successfully Updated Listing!");
            res.redirect(`/listings/${id}`);
        };
        

            module.exports.deletelisting=async (req, res) => {
                    const { id } = req.params;
                    const deletedListing = await Listing.findByIdAndDelete(id);
                    if (!deletedListing) {
                        throw new Expresserror(404, "Listing not found");
                    }
                    req.flash("success", "Listing Deleted Successfully!");
                    res.redirect("/listings");
                }

