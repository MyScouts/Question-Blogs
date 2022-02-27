require('dotenv').config()
const mongooseClient = require('mongoose')


const MONGOOSE_URI = process.env.MONGOOSE_URI

const DBConnection = async () => {
    try {
        await mongooseClient.connect(MONGOOSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Mongoose connection is successfull!")
    } catch (error) {
        console.log("🚀 ~ file: app_database.js ~ line 9 ~ DBConnection ~ error", error)
    }
}

module.exports = DBConnection