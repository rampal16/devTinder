const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: "+value)
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!['male', 'female', 'others'].includes(value)) {
                throw new Error("Invalid Gender detail.")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid photo Url: "+value)
            }
        }
    },
    about: {
        type: String,
        default: "This is about me..."
    },
    skills: {
        type: [String]
    }
}, { timestamps: true})

const User = mongoose.model("User", userSchema);

module.exports = User;