const mongoose = require('mongoose')
const colors= require('colors')

const connectDB = async () => {
    try{
        console.log("MONGO_URL:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL )
    
    console.log(`connected to database ${mongoose.connection.host}`.bgCyan.white);
    }
    catch(error){
        console.log(`error in connection DB ${error}`.bgRed.white);
    
    }
};

module.exports = connectDB;


