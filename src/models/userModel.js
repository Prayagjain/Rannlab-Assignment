const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    schoolName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: { 
        type: String,
        require: true 
    },
    assignments:[{
        assignmentId:{type:ObjectId, ref:"Assignment"},
        _id:0
    }]

},{timestamps:true});

module.exports = new mongoose.model("User",userSchema)