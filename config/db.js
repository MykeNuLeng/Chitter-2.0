const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
       await mongoose.connect(db, { 
           useNewUrlParser: true,
           useUnifiedTopology: true
        });

       console.log("MongoDB connected...")
    } catch (error) {
        console.error(error.message);
        // Exit process if you can't connect to MongoDB
        process.exit(1);
    }
}

module.exports = connectDB;