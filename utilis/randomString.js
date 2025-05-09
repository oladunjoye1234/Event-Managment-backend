const crypto = require("crypto")

const genRandomString = (number)=>{
    const randomString = crypto.randomBytes(number).toString("hex")
    return randomString
}

module.exports = genRandomString