const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation")
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignupData(req);

        // encrypt the password
        const { password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash)

        // save user
        const user = new User({ ...req.body, password: passwordHash });

        await user.save();
        res.send("User added successfully")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // create a jwt token
            const token = await jwt.sign({ _id: user._id }, "MySecret@123");

            // add the token to cookie and send the response back to server.
            res.cookie("token", token);

            res.send("Login Successful !!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("Error: " + error.message);
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const cookies = req.cookies;

        console.log(cookies);
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
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
        res.status(400).send("Update failed: " + error.message)
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
