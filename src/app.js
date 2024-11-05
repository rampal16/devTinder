const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();


app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: 'Ram',
        lastName: 'Pal',
        emailId: 'something@gmail.com',
        password: 'hello@123'
    })

    try {
        await user.save();
        res.send("User added successfully")
    } catch (error) {
        res.status(400).send("Error saving the user", error.message)
    }
})


connectDB()
    .then(() => {
        console.log('Databse connection is successful !!');
        app.listen(3000, () => {
            console.log("Server is running on port 3000")
        });
    }).catch(() => {
        console.log('Failed to connect with database.')
    })


