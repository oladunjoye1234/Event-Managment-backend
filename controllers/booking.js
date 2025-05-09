const Booking = require("../models/booking");
const Event = require("../models/event");
const mongoose = require("mongoose");
const { bookingConfirmationTemplate } = require("../utilis/emailTemplates");
const { sendEmail } = require("../services/transporter");
const User = require("../models/user");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs").promises;

const bookEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const eventDetails = await Event.findById(eventId).select(
      "title description date time location price image"
    );
    if (!eventDetails) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    console.log("Event details:", eventDetails);

    const existingBooking = await Booking.findOne({
      event: eventId,
      user: userId,
    });
    if (existingBooking) {
      return res.status(400).json({
        status: "error",
        message: "You have already booked this event",
      });
    }

    const booking = await Booking.create({
      event: eventId,
      user: userId,
    });

    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.warn("User or email not found for booking confirmation:", userId);
      return res.status(404).json({
        status: "error",
        message: "User not found or email not available",
      });
    }

    // Ensure public/qrcodes directory exists
    const qrCodeDir = path.join(__dirname, "../public/qrcodes");
    await fs.mkdir(qrCodeDir, { recursive: true });

    // Generate QR code data
    const qrCodeData = `http://localhost:5173/dashboard?bookingId=${booking._id}`;

    // Fallback: Generate QR code as data URL
    let qrCodeUrl;
    try {
      qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
        width: 150,
        margin: 1,
      });
      console.log(`QR code data URL generated for booking ${booking._id}:`, qrCodeUrl.substring(0, 50));
    } catch (dataUrlError) {
      console.error("Error generating QR code data URL:", dataUrlError);
    }

    // Try saving QR code to file (primary approach)
    if (qrCodeUrl) {
      const qrCodePath = path.join(qrCodeDir, `${booking._id}.png`);
      try {
        await QRCode.toFile(qrCodePath, qrCodeData, {
          width: 150,
          margin: 1,
        });
        console.log(`QR code saved for booking ${booking._id} at ${qrCodePath}`);
        await fs.access(qrCodePath);
        qrCodeUrl = `http://localhost:3000/qrcodes/${booking._id}.png`;
        console.log(`Using hosted QR code URL: ${qrCodeUrl}`);
      } catch (fileError) {
        console.error("Error saving QR code file:", fileError);
        console.log("Falling back to data URL for QR code");
      }
    } else {
      throw new Error("Failed to generate QR code");
    }

    // Send confirmation email
    const emailContent = bookingConfirmationTemplate({
      event: {
        title: eventDetails.title,
        description: eventDetails.description,
        date: eventDetails.date,
        time: eventDetails.time,
        location: eventDetails.location,
        price: eventDetails.price || 0,
        image: eventDetails.image,
      },
      user,
      bookingId: booking._id,
      qrCodeUrl,
    });
    console.log("Booking email content generated for:", user.email);
    console.log("Email content preview:", emailContent.substring(0, 200));
    await sendEmail({
      to: user.email,
      subject: `Booking Confirmation for ${eventDetails.title}`,
      html: emailContent,
    });
    console.log(`Email sent to ${user.email} with QR code URL: ${qrCodeUrl}`);

    res.status(201).json({
      status: "success",
      message: "Event booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Error in bookEvent:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const bookedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate("event");

    // Filter out bookings where event is null
    const bookingsWithDetails = bookings
      .filter((booking) => booking.event !== null)
      .map((booking) => ({
        bookingId: booking._id,
        event: booking.event,
      }));

    res.status(200).json({
      status: "success",
      message:
        bookingsWithDetails.length > 0
          ? "Booked events retrieved successfully"
          : "No valid booked events found",
      bookings: bookingsWithDetails,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid booking ID",
    });
  }

  try {
    const booking = await Booking.findOne({ _id: id, user: userId });
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found or you don't have permission to delete it",
      });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

module.exports = {
  bookEvent,
  bookedEvents,
  deleteBooking,
};