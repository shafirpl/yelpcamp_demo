//=====================
//Comments Route
//=====================

var express             = require("express");
var router              = express.Router();
var Campground          = require("../models/campgrounds.js");
var Comment             = require("../models/comments.js");

//comment new
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res) {
    // res.send("This will be comment form");
        Campground.findById(req.params.id).populate("comments").exec(function(err,foundItem){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundItem);
            res.render("comments/new",{campground:foundItem});
        }
    });
    
});

//comment create
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    
        Campground.findById(req.params.id,function(err,foundItem){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comments,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                         // add username and id to comment
                        // save comment
                        
                        //The way we could get the user is to
                        //use req.user(), because
                        //recall that the only way an user can post 
                        //a comment if s/he is logged in, so 
                        //req.user() should have the username
                        //req.user contains username and id
                    
                    //this associate/fill up the id section of our author in the comment.js file in model
                    comment.author.id = req.user._id;
                    //this associate/fill up the user section of our author in the comment.js file in model
                    comment.author.username = req.user.username;
                    //saving the comment
                    comment.save();
                    foundItem.comments.push(comment);
                    foundItem.save();
                    console.log(comment);
                    res.redirect("/campgrounds/"+foundItem._id);
                }
            });
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

module.exports = router;