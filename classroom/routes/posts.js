const express=require("express");
const router=express.Router();

//postrs

router.get("/",(req,res)=>{
    res.send("hi get for posts");
});

router.get("/:id",(req,res)=>{
    res.send("this is user Show route");
});

router.post("/",(req,res)=>{
    res.send("hi Post user");
});

router.delete("/:id",(req,res)=>{
    res.send("delete route");
});

module.exports=router;