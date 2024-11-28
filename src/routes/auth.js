const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { validateSignupData } = require("../utils/validation")

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(user.password, password);

        if (!isPasswordValid) {
            // create a jwt token
            const token = await jwt.sign({ _id: user._id }, "MySecret@123", { expiresIn: '1d' });

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

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now())});
    
    res.send("Logged out.");
})

module.exports = authRouter;