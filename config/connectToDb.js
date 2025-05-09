const mongoose = require("mongoose")
const dotEnv = require("dotenv")
dotEnv.config()

const mongoUrl = process.env.MONGO_URL

const connectToMongoDb = async ()=>{
    try {
        const connected = await mongoose.connect(mongoUrl)
        if(connected){
            console.log('MongoDB Connected')
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongoDb