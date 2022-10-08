const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    pin: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },

    },
    address: {
        type: Object
    },
    createdAt: {
        type: Number,
    },
});

userSchema.index({ location: '2dsphere' });

const user = mongoose.model("user", userSchema);

module.exports = { user };