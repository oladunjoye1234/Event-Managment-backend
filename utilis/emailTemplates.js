const bookingConfirmationTemplate = ({ event, user, bookingId, qrCodeUrl }) => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .qr-code { text-align: center; margin: 20px 0; }
        .qr-code img { width: 150px; height: 150px; }
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <span className="text-lg font-bold">Eventnow</span>
            <h2>Booking Confirmation</h2>
          </div>
          <div className="content">
            <p>Dear ${user.fullName || "Attendee"},</p>
            <p>Thank you for booking an event with us! Here are the details of your booking:</p>
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(
              event.date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price:</strong> $${event.price}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
          <div className="qr-code">
            <p>Scan the QR code below to view your booking details:</p>
            <img src="${qrCodeUrl}" alt="Booking QR Code" " />
          </div>
          <p>We look forward to seeing you at the event!</p>
            <a href="http://localhost:5173/dashboard" className="button">View Your Bookings</a>
          </div>
          <div className="footer">
            <p>Event Management System &copy; ${new Date().getFullYear()}</p>
            <p>If you have any questions, contact us at support@eventmanagement.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

const eventCreationConfirmationTemplate = ({ event, user, qrCodeUrl }) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; }
          .qr-code { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; }
          .qr-code { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h2>Event Creation Confirmation</h2>
          </div>
          <div className="content">
            <p>Dear ${user.fullName || 'Organizer'},</p>
            <p>Congratulations! You have successfully created a new event. Here are the details:</p>
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price:</strong> ${event.price !== undefined && event.price !== null ? `$${event.price}` : 'Free'}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Event ID:</strong> ${event._id}</p>
            ${qrCodeUrl ? `
              <div className="qr-code">
                <p>Scan the QR code below to view your event details:</p>
                <img src="${qrCodeUrl}" alt="Event QR Code" style="width: 150px; height: 150px;" />
              </div>
            ` : ''}
            <p>Thank you for using our platform to organize your event!</p>
            <a href="http://localhost:3000/dashboard" className="button">View Your Events</a>
          </div>
          <div className="footer">
            <p>Event Management System © ${new Date().getFullYear()}</p>
            <p>If you have any questions, contact us at support@eventmanagement.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  

module.exports = { bookingConfirmationTemplate, 
    eventCreationConfirmationTemplate

 };
