const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const getHelpers = {
    currentProfile: (req, res) => {
        const {id} = req.user;
        Profile.findOne({_user: id})
            .populate("_user", ["name", "avatar"]) // fetching data from bind schema
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
    },
    withHandleProfile: (req, res) => {
        Profile.findOne({handle: req.params.handle})
            .populate("_user", ["name", "avatar"]) // fetching data from bind schema
            .then(profile => {
                if (!profile) return res.status(404).json({profile: "Profile not found."});
                res.json(profile);
            })
            .catch(err => {
                console.log(
                    `\n < profiles.js:31 > ERROR: IN withHandleProfile. While getting Profile we've got \n
                        ${err}`);
                return res.status(400).json(err);
            });
    },
    userIdProfile: (req, res) => {
        Profile.findOne({handle: req.params.id})
            .populate("_user", ["name", "avatar"]) // fetching data from bind schema
            .then(profile => {
                if (!profile) return res.status(404).json({profile: "Profile not found."});
                res.json(profile);
            })
            .catch(err => {
                console.log(
                    `\n < profiles.js:31 > ERROR: IN userIdProfile. While getting Profile we've got \n
                        ${err}`);
                return res.status(400).json(err);
            });
    },
};

const postHelpers = {
    saveProfile: (req, res) => {
        //TODO: validation of received data
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
                    const {handle, employment } = req.body;
                    // create new Profile and save it to DB
                    const newProfile = new Profile(
                        {
                            _user: id,
                            handle,
                            employment
                        }
                    );
                    newProfile.save()
                        .then(profile => {
                            res.json(profile);
                        })
                        .catch(err => {
                            console.log(
                                `\n < profiles.js:89 > ERROR: IN saveProfile. While saving newProfile we've got \n
                        ${err}`);
                            return res.status(400).json(err);
                        });

                }
            })
    },
    addContactsProfile: (req, res) => {
        //TODO: VALIDATION
        Profile.findOne({_user: req.user.id})
            .then(profile => {
                const newContact = {
                    phonenumber: req.body.phonenumber
                };

                profile.contacts.unshift(newContact);

                profile.save()
                    .then(profile =>
                        res.json(profile));
            });
    }
};

const deleteHelpers = {
    deleteContact: (req, res) => {
        const index = req.params.cont_id;
        Profile.findOne({_user: req.user.id})
            .then(profile => {
                const removeIndex = profile.contacts
                    .map(item => item.id)
                    .indexOf(index);

                profile.contacts.splice(removeIndex, 1);

                profile.save()
                    .then(profile =>
                        res.json(profile));

            });
    }
};


// @route GET api/profiles/handle/:handle
// @desc returns profile for handle bind to user ( for public use )
// @access Public
router.get(
    "/handle/:handle",
    (req, res) => getHelpers.withHandleProfile(req, res));

// @route GET api/profiles/users/:user_id
// @desc returns profile for handle bind to user ( for public use )
// @access Public
router.get(
    "/users/:id",
    (req, res) => getHelpers.userIdProfile(req, res));

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

// @route POST api/profiles/contacts/
// @desc add contacts array to exact Profile for exact user
// @access Private
router.post(
    "/contacts",
    passport.authenticate("jwt", {session: false}),
    (req, res) => postHelpers.addContactsProfile(req, res));

// @route DELETE api/profiles/contacts/:index
// @desc removes contact from array in exact Profile for exact user
// @access Private
router.delete(
    "/contacts/:cont_id",
    passport.authenticate("jwt", {session: false}),
    (req, res) => deleteHelpers.deleteContact(req, res));

// @route GET api/profiles/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "profiles GET WORKS"}));

module.exports = router;