const {createTransport} = require('nodemailer');
require('dotenv').config();

const transporter = createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT,
    secure  : process.env.EMAIL_SECURE,
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD
    }
})

 const sendEmail = async ({to, subject,html}) => {
    try{
        await transporter.sendMail({
            from:`"Event Management" <${process.env.APP_EMAIL}>`,
            to,
            subject,
            html
        });
        console.log('Email sent successfully to ${to}');

    }catch(error){
        console.error('Error sending email:', error);
        throw new Error('Email not sent');

}
    
    }

transporter.verify((error, success) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Server is ready to take messages");
}
if (success){
    console.log(success)
}

})

module.exports = {
    sendEmail,
    transporter
} 
