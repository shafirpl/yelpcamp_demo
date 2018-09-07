var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var request             = require('request');
var mongoose            = require("mongoose");
var seedDB              = require("./seeds");
var passport            = require("passport");
var localStrategy       = require("passport-local");
var User                = require("./models/user");
var methodOverride      = require("method-override");
var expressSession      = require("express-session");

//modules export
var Campground          = require("./models/campgrounds");
var Comment             = require("./models/comments");

//routes
var campgroundRoutes    = require("./routes/campgrounds");
var commentRoutes       = require("./routes/comments");
var indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
//__dirname is equivalent to /home/ubuntu/workspace/YelpCamp/v5
//console.log(__dirname);
app.use(methodOverride("_method"));


//seed the database
//seedDB();

//Passport Configuration
app.use(expressSession({
    secret:"Shafi is the best",
    resave: false,
    saveUninitialized: false
}));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========
//ROUTES
//===========

//in order to show the username to every single page
//we had to use this function, which means
//every single page have access to currentUser or the user
//that is signed in
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    //To move on to the next part or after what the middleware comes
    //we need next
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(5000,function(){
    console.log("Server has started");
});
