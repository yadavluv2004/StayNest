require("dotenv").config(); // Load environment variables
const { cloudinary } = require("./cloudConfig.js"); // Import cloudinary configuration

// Test Cloudinary API connection
cloudinary.api.ping()
    .then(response => console.log("✅ Cloudinary is working:", response))
    .catch(err => console.error("❌ Cloudinary connection failed:", err));

