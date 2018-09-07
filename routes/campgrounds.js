var express             = require("express");
var router              = express.Router();
var Campground          = require("../models/campgrounds.js");
var Comment             = require("../models/comments.js");

//root route
router.get("/",function(req,res){
    res.render("landing");
});


//Our index route- show all campgrounds
router.get("/campgrounds",function(req,res){
    /*
    eval will freeze our website and allow us to run code one by one, kind of like c gdb debugger
    */
    //eval(require("locus"));
    console.log(req.user);
    //recall our name of the input where we are submitting the search is named search, so
    //it has to be req.query.search for our search string
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        console.log("The query is: " + regex);
        Campground.find({name:regex},function(err,campgrounds){
            if(err){
                console.log(err);
            } else{
                res.render("campgrounds/index",{campgrounds:campgrounds, currentUser:req.user});
            }
    });
        
    }
    
    //if no search string exists, just show all the campgrounds
    else{
            Campground.find({},function(err,campgrounds){
                if(err){
                    console.log(err);
                } else{
                    res.render("campgrounds/index",{campgrounds:campgrounds, currentUser:req.user});
                }
     });
 }

        // res.render("campgrounds",{campgrounds:campgrounds});
});

//our create route- add new campground to database

router.post("/campgrounds",isLoggedIn,function(req,res){
   
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username: req.user.username
    };
    var object = {name:name, image:image, description:description, author:author};
   
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
router.get("/campgrounds/new",isLoggedIn,function(req,res){
    
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

//EDIT Campground Route
router.get("/campgrounds/:id/edit",checkCamgroundOwnership,function(req, res) {
    //is the user logged in?
        Campground.findById(req.params.id,function(err,foundCampground){
            //we already handled error with the middleware
            res.render("campgrounds/edit",{campground:foundCampground});
        });
});
//UPDATE Campground Route
router.put("/campgrounds/:id",checkCamgroundOwnership,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,
    function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            //redirect to show page
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",checkCamgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


function checkCamgroundOwnership(req,res,next){
        if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
                console.log(err);
            } else{
                //if s/he is logged in, does s/he own the campground
                 if(foundCampground.author.id.equals(req.user._id)){
                    //we will be moving on the next function, which may be 
                    //update or delete
                   next(); 
                } else{
                    res.redirect("back");
                }
            }
        });
    }
    //if not, redirect
    else{
        res.redirect("back");
    }
}

//this will ensure our server is not slowed down and is ddos attack proof
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;