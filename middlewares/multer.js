const multer = require('multer')  


const { CloudinaryStorage } = require('multer-storage-cloudinary')


const cloudinary = require('./cloundinaryConfig')




const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params:{
        folder: 'Events',
        allowedFormats: ['png','jpg','gif'], // optional 
        transformation : [{width: 500, height:500 }] // resize image optional
    }
})


const upload = multer ( { storage})

module.exports = upload