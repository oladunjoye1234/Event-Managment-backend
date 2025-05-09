const app = require("./app");
const PORT = process.env.PORT || 3000
const dotEnv = require("dotenv");
dotEnv.config()

const connectToMongoDb = require("./config/connectToDb");
const connected = connectToMongoDb()

if(connected){
    app.listen(PORT, ()=>{
        console.log(`Listening for server on port ${PORT}`)
    })
} else {  
    console.log("Failed to connect to MongoDB")
}
