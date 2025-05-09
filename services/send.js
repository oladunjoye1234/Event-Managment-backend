const transporter = require('./transporter');

const sendVerificationEmail = async (fullname, email, token) => {
    console.log("Sending email to: ", email);
    const emailOptions = {
        from: process.env.APP_EMAIL,
        to: email,
        subject: "Account Created Successfully",
        html: `
        <div className="flex items-center gap-4">
        <span className="text-lg font-bold">Eventnow</span>
        <h1>Hi ${fullname},
            Thanks for creating an account with us.
        </h1>
       </div>
        `
    }
    transporter.sendMail(emailOptions, (error, info) => {
        if(error){
            console.log(error);
        }
        console.log("Email sent: ", info.response);
    })
}

module.exports = sendVerificationEmail;
// Compare this snippet from services/send.js: