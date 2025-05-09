const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
      },
      phoneNumber: {  
        type: String,
        required: true,
        unique: true,
      },  
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      role: { 
        type: String, enum: ["organizer", "attendee"], 
        default: "attendee" 
      },
      
},
{timestamps: true})

module.exports = mongoose.model("User", userSchema);