const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
            const res = await mongoose.connect(process.env.MONGODB_URI)
            // console.log("Connected")
            console.log(`Connected: ${res.connection.host} ${res.connection.name}`)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDB