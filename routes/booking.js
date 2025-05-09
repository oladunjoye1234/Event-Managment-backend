const express = require("express")
const router = express.Router()
const {bookEvent, deleteBooking, bookedEvents } = require("../controllers/booking")
const {isLoggedIn, isAttendee} = require("../middlewares/auth")

router.route("/event/:eventId").post(isLoggedIn, isAttendee, bookEvent)
router.route("/booked").get(isLoggedIn, isAttendee, bookedEvents)
router.route("/event/:id").delete(isLoggedIn, isAttendee, deleteBooking)

module.exports = router