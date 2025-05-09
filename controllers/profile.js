const user = require("../models/user"); 


exports.getProfile = async (req, res) => {
    try {   
        const userId = req.user._id;
        const userProfile = await user.findById(userId).select("-password");
        if (!userProfile) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: userProfile,
        });
    } catch (error) {   
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "error finding user",
        
        });
        
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, email, phone } = req.body;
        const userProfile = await user.findByIdAndUpdate(userId, { fullName, email, phone }, { new: true }).select("-password");
        if (!userProfile) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: userProfile,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "error updating user",
        });
    }
}