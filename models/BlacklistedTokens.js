const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        trim: true,
    }
}, {timestamps: true})

const blacklistedTokenModels = mongoose.model("BlacklistedToken", blacklistedTokenSchema);

module.exports = blacklistedTokenModels;