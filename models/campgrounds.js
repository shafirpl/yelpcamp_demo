var mongoose = require("mongoose");


//campground config
//Here we will use reference to add comments
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        
        username:String
    },
    comments: [
        {//this means the we are storing arrays of object id, each of which refers to comment
        type:mongoose.Schema.Types.ObjectId,
        ref: "Comment"}
        ]
});

var Campground = mongoose.model("Campground",campgroundSchema);

module.exports = Campground;