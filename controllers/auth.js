const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genRandomString = require("../utilis/randomString");
require("dotenv").config();
const sendVerificationEmail = require("../services/send");


//SIGNUP
const signup = async (req, res, next) => {
  const {fullName,  email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
  }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = genRandomString(16)
    const verificationExp =  Date.now() + 36000000

    const user = await UserModel.create({
        ...req.body,
      password: hashedPassword,
      verificationToken,
      verificationExp
    });
    if (!user) {
      res.status(400).json({
        status: "error",
        message: "Unable to signup",
      });
      return;
    }
    sendVerificationEmail(fullName, email, verificationToken,); //send verification email
    res.status(201).json({
      status: "success",
      message: "Sign up successful.",
      user,
    
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(404).json({
                status: "failed",
                message: "User not found",
            })
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(401).json({
                status: "failed",
                message: "Invalid credentials",
                
            })
            return;
        }
     

        const token = jwt.sign({id:user._id}, 
        process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION})
        res.status(200).json({
            status: "success",
            message: "Login successful",
            user,
            token
        })

    } catch (error) {
        console.log(error);
}
}

module.exports = {
    signup,
    login
}