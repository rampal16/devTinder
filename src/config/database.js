const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://xxx:xxx@cluster0.oacmf.mongodb.net/devTinder")
}

module.exports = connectDB;
