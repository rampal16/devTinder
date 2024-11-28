const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const cookies = req.cookies;

        console.log(cookies);
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request.")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.send("Profile updated successfully.");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = profileRouter;
