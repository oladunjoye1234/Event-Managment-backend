const BlackListedTokens = require("../models/BlacklistedTokens");
const jwt = require("jsonwebtoken");
const Usercols = require("../models/user");






const isLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "Token not provided",
    });
  }

  const blacklisted = await BlackListedTokens.findOne({ token });
  if (blacklisted) {
    return res.status(403).json({
      status: "error",
      message: "Token has been blacklisted",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usercols.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};





const isOrganizer = (req, res, next) => {

  if (req.user.role !== "organizer") {
    res.status(403).json({
      status: "error",
      message: "You have to be an organizer to access this route",
    });
    return;
  }

  next();
};

const isAttendee = (req, res, next) => {
  if (req.user.role !== "attendee") {
    res.status(403).json({
      status: "error",
      message: "You have to be an attendee to access this route",
    });
    return;
  }

  next();
};

const authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "Token not provided",
    });
  }

  const blacklisted = await BlackListedTokens.findOne({ token });
  if (blacklisted) {
    return res.status(403).json({
      status: "error",
      message: "Token has been blacklisted",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usercols.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};



module.exports = {
  isLoggedIn,
  isOrganizer,
  isAttendee,
  authenticateUser,
  
};


// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided", status: "fail" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found", status: "fail" });
//     }

//     req.user = user; // 🎯 Set the authenticated user on the request
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "Unauthorized", status: "fail" });
//   }
// };