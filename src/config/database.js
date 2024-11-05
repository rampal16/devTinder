const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://admin0:admin@cluster0.oacmf.mongodb.net/devTinder")
}

module.exports = connectDB;
