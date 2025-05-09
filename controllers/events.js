const eventModel = require("../models/event");
const mongoose = require("mongoose");
const User = require("../models/user");
const { eventCreationConfirmationTemplate } = require("../utilis/emailTemplates");
const { sendEmail } = require("../services/transporter");
const QRCode = require("qrcode");



const getEvents = async (req, res) => {
  try {
    const events = await eventModel.find();
    res.status(200).json({
      status: "success",
      message: "All events",
      events,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Event",
      event,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getEventsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.user._id;
    console.log(organizerId);

    const events = await eventModel.find({ organizer: organizerId });

    res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    console.error("Error fetching organizer's events:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
const createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Please upload a picture",
      });
    }

    const event = await eventModel.create({
      ...req.body,
      organizer: req.user._id,
      image: req.file.path,
    });

    // Fetch organizer details for email
    const user = await User.findById(req.user._id);
    if (!user || !user.email) {
      console.warn("User or email not found for event creation confirmation:", req.user._id);
    } else {
      // Generate QR code as a data URL
      const qrCodeData = `http://localhost:3000/dashboard?eventId=${event._id}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
        width: 150,
        margin: 1,
      });

      // Send confirmation email
      const emailContent = eventCreationConfirmationTemplate({
        event,
        user,
        qrCodeUrl,
      });
      await sendEmail({
        to: user.email,
        subject: `Event Creation Confirmation: ${event.title}`,
        html: emailContent,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Event created",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        status: "failed",
        message: "Invalid event ID",
      });
      return;
    }

    const event = await eventModel.findByIdAndDelete(id);
    if (!event) {
      res.status(404).json({
        status: "error",
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
      event,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Unable to delete event",
    });
  }
};

const searchEvents = async (req, res) => {
  const { search, title, location, description } = req.query;

  const query = {};
  try {
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (title) query.title = title;
    if (location) query.location = location;
    if (description) query.date = description;

    const event = await eventModel.find(query);
    res.status(200).json({
      status: "success",
      count: event.length,
      message: "Event",
      event,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Unable to search event",
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid event ID",
      });
    }

    const event = await eventModel.findById(id);
    if (!event) {
      return res.status(404).json({
        status: "failed",
        message: "Event not found",
      });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "You are not authorized to update this event",
      });
    }

    const { title, location, price, date, time, description, image } = req.body;

    if (title) event.title = title;
    if (location) event.location = location;
    if (price !== undefined) event.price = Number(price); // ✅ convert price
    if (date) event.date = date;
    if (time) event.time = time;
    if (description) event.description = description;
    if (image) event.image = image;

    const updatedEvent = await event.save();

    res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error while updating event",
    });
  }
};


module.exports = {
  getEvents,
  getEvent,
  createEvent,
  deleteEvent,
  searchEvents,
  getEventsByOrganizer,
  updateEvent,
};
