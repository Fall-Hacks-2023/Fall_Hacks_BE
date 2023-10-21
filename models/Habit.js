const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    achievementDate: {
        type: Date,
    },
    interval: {
        type: {
            type: String,
            enum: ['minutes', 'days', 'weeks', 'months'],
        },
        number: Number,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
});

const User = mongoose.model("Habit", habitSchema, 'habit');

module.exports = User;