const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing.js");

const MONGO_URL='mongodb://127.0.0.1:27017/wanderLust';
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connection with database");
}).catch((err)=>{
console.log(err);
});

const initDb= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "67af30d93d89fb2a5af574ae"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
};

initDb();
