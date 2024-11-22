const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found !!")
        } else {
            res.send(users);
        }

    } catch (error) {
        res.status(400).send("Something went wrong...")
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("User not found !!")
        } else {
            res.send(users);
        }

    } catch (error) {
        res.status(400).send("Something went wrong...")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully.")

    } catch (error) {
        res.status(400).send("Something went wrong...")
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const updateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));

    try {
        if (!updateAllowed) {
            throw new Error("Update not allowed.")
        }
        await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true
        });
        res.send("User updated successfully.")

    } catch (error) {
        res.status(400).send("Update failed: "+error.message)
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
