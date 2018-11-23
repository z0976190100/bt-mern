const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const getHelpers = {
    currentProfile: (req, res) => {
        const {id} = req.user;
        Profile.findOne({_user: id})
            .populate("_user", ["name", "avatar"])
            .then(profile => {
                if (!profile) return res.status(404).json({profile: "Profile not found."});
                res.json(profile);
            })
            .catch(err => {
                console.log(
                    `\n < profiles.js:17 > ERROR: IN currentProfile. While getting Profile we've got \n
                        ${err}`);
                return res.status(400).json(err);
            });
    }
};

const postHelpers = {
    saveProfile: (req, res) => {
        //validation of received data
        // const {errors, isValid} = validateRegistrationData(req.body);
        // if (!isValid) {
        //     return res.status(400).json(errors);
        // }

        const errors = [];
        const id = req.user.id;
        //check if similar Profile already exists
        Profile.findOne({_user: id})
            .then(profile => {
                if (profile) {
                    // TODO: throw ERROR in such cases
                    errors.push({
                        parameter: "profile",
                        "exists": "Profile for this User already exists."
                    });
                    return res.status(400).json(errors);
                } else {
                    const {handle, employment, phonenumber} = req.body;
                    // create new Profile and save it to DB
                    const newProfile = new Profile(
                        {
                            _user: id,
                            handle,
                            employment,
                            phonenumber
                        }
                    );
                    newProfile.save()
                        .then(profile => {
                            res.json(profile);
                        })
                        .catch(err => {
                            console.log(
                                `\n < profiles.js:60 > ERROR: IN saveProfile. While saving newProfile we've got \n
                        ${err}`);
                            return res.status(400).json(err);
                        });

                }
            })
    }
};


// @route GET api/profiles/current
// @desc returns profile for current logged user
// @access Private
router.get(
    "/current",
    passport.authenticate("jwt", {session: false}),
    (req, res) => getHelpers.currentProfile(req, res));

// @route POST api/profiles/
// @desc saves new Profile for exact user to DB
// @access Private
router.post(
    "/",
    passport.authenticate("jwt", {session: false}),
    (req, res) => postHelpers.saveProfile(req, res));

// @route GET api/profiles/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "profiles GET WORKS"}));

module.exports = router;