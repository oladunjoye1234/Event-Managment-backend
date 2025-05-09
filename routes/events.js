const express = require("express");
const { deleteEvent, createEvent, getEvent, getEvents, searchEvents, getEventsByOrganizer, updateEvent,   } = require("../controllers/events");
const { isLoggedIn,  isOrganizer, } = require("../middlewares/auth");
const router = express.Router()
const Event = require("../models/event")
const upload = require('../middlewares/multer');
// const {bookEvent} = require("../controllers/booking")

router.route("/event/search").get(searchEvents)
router.route("/event/:id").get(getEvent)
router.route("/event").get(getEvents)
router.route("/organizer").get(isLoggedIn, isOrganizer,getEventsByOrganizer)

// router.route("/event/:eventId/book").get(isLoggedIn, isAttendee, bookEvent)
// router.route("/AllEvents").upload.single('image').post(isLoggedIn, isOrganizer, createEvent)
router.post("/AllEvents", isLoggedIn, isOrganizer, upload.single("image"), createEvent)
router.route("/event/:id").delete(isLoggedIn, isOrganizer, deleteEvent)
router.route("/event/:id").put(isLoggedIn, isOrganizer,updateEvent)





module.exports = router


