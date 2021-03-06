const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load custom validator
// KUNG-FUSION: should i implement validation based on model schema?
const validateRegistrationData = require("../../validation/registration");

//post helper functions
const postHelpers = {
    saveProfile: (req, res) => {
        //validation of received data
        const {errors, isValid} = validateRegistrationData(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const {name, email, password} = req.body;
        //check if similar User already exists
        User.findOne({email})
            .then(user => {
                if (user) {
                    // TODO: throw ERROR in such cases
                    errors.push({
                        parameter: "email",
                        "exists": "User with this email already exists."
                    });
                    return res.status(400).json(errors);
                } else {
                    // create avatar
                    const avatar = gravatar.url(email,
                        {
                            s: "200", //size
                            r: "pq", //rating
                            d: "mm" //default
                        }
                    );
                    // create new User and save it to DB
                    const newUser = new User(
                        {
                            name,
                            email,
                            password,
                            avatar
                        }
                    );
                    // salting password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    res.json(user);
                                })
                                .catch(err => {
                                    console.log(
                                        `\n < users.js:47 > ERROR: IN saveUser. While saving newUser we've got \n
                        ${err}`);
                                    return res.status(400).json(err);
                                });
                        });
                    });
                }
            })
    },
    loginUser: (req, res) => {
        //check if user exists
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    return res.status(404).json({email: "User not found."});
                }
                // unsalting and check if password is matching
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            // user matches
                            const {id, name, avatar, date} = user;
                            const payload = {
                                id,
                                name,
                                avatar,
                                date
                            };
                            // sign Token
                            jwt.sign(
                                payload,
                                keys.SECRET_OR_KEY,
                                {expiresIn: 3600},
                                (err, token) => {
                                    res.json(
                                        {
                                            msg: "Log in is SUCCESSFULL.",
                                            success: true,
                                            token: "Bearer " + token
                                        }
                                    );
                                });

                        } else {
                            return res.status(400).json({password: "Password is incorrect."});
                        }
                    });
            })
    }
};

const getHelpers = {
    currentUser: (req, res) => {
        const {id, name, email} = req.user;
        res.json(
            {
                id,
                name,
                email
            });
    }
};

const deleteHelpers = {
    deleteUser: (req, res) => {
        Profile.findOneAndRemove({_user: req.user.id})
            .then(() => {
                    User.findOneAndRemove({id: req.user.id})
                        .then(() => res.json({success: true}))
                        .catch(err => {
                            console.log(
                                `\n < users.js:133 > ERROR: IN deleteUser. While deleting User we've got  \n
                        ${err}`);
                            return res.status(400).json(err);
                        });
                })
            .catch(err => {
                console.log(
                    `\n < users.js:138 > ERROR: IN deleteProfile. While deleting Profile we've got \n
                        ${err}`);
                return res.status(400).json(err);
            });

    }
};

// @route GET api/users/current
// @desc returns current logged user
// @access Private
router.get(
    "/current",
    passport.authenticate("jwt", {session: false}),
    (req, res) => getHelpers.currentUser(req, res));


// @route POST api/users/
// @desc saves new user to DB
// @access Public
router.post("/", (req, res) => postHelpers.saveUser(req, res));

// @route DELETE api/users/
// @desc removes user and profile
// @access Private
router.post(
    "/",
    passport.authenticate("jwt", {session: false}),
    (req, res) => deleteHelpers.deleteUser(req, res));

// @route POST api/users/login
// @desc saves new user to DB
// @access Public
router.post("/login", (req, res) => postHelpers.loginUser(req, res));

// @test
// @route GET api/users/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "users GET WORKS"}));

module.exports = router;
