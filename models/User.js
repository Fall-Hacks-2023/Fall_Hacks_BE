const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type:String,
        required: true,
    },
    lastName: {
        type:String,
        required: true,
    },
    age: {
        type:Number,
        required: false,
    },
    joinDate: {
        type:Date,
        required: true,
    },
    points: {
        type:Number,
        required: true,
    },
})

const User = mongoose.model("User", userSchema, 'user');

module.exports = User;