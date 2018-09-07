var express             = require("express");
var router              = express.Router();
var Campground          = require("../models/campgrounds.js");
var Comment             = require("../models/comments.js");

router.get("/",function(req,res){
    res.render("landing");
});


//Our index route- show all campgrounds
router.get("/campgrounds",function(req,res){
     console.log(req.user);
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:campgrounds, currentUser:req.user});
        }
    });
        // res.render("campgrounds",{campgrounds:campgrounds});
});

//our create route- add new campground to database

router.post("/campgrounds",function(req,res){
   
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var object = {name:name, image:image, description:description};
    //creating a new campground
    Campground.create(object,function(err,campground){
       if(err){
        console.log(err)
       }
       else{
           res.redirect("/campgrounds");
       }
    });
});

//our new route - show the new campground form
router.get("/campgrounds/new",function(req,res){
    
    res.render("campgrounds/new");
})

//SHOW Route
router.get("/campgrounds/:id",function(req, res) {
    //res.send("This will be the show page one day");
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundItem){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundItem);
            res.render("campgrounds/show",{campground:foundItem});
        }
    });
    
});

module.exports = router;