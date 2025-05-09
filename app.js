const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const path = require("path")


app.use(cors());
app.use(express.json());
app.use(morgan("dev"))
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));



const AuthRoutes = require("./routes/auth")
const EventRoutes = require("./routes/events")
const BookingRoute = require("./routes/booking")
const ProfileRoute = require("./routes/profile")
// const updateProfile = require("./controllers/profile")
app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/events', EventRoutes)
app.use('/api/v1/booking', BookingRoute)
app.use('/api/v1/profile', ProfileRoute)



app.all("*", (req, res)=>{
    res.json({
        message: `${req.method} ${req.originalUrl} is not an endpoinit on this server.`
    })
})
module.exports = app