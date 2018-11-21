const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
// @route GET api/users/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "users GET WORKS"}));

//post helper function
const postCallback = (req, res) => {

    //check if similar User already exists
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: "User already exists"});
            } else {
                // create avatar
                const avatar = gravatar.url(req.body.email,
                    {
                        s: "200", //size
                        r: "pq", //rating
                        d: "mm" //default
                    }
                );
                // create new User and save it to DB
                const newUser = new User(
                    {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
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
                                //LOGGER
                                console.log(
                                    `\n < users.js:34 > IN postCallback for ('/api/users') save newUser = \n
                        ${newUser}`
                                );
                                // END LOGGER
                                res.json(user);
                            })
                            .catch(err => console.log(
                                `\n < users.js:47 > IN postCallback for ('/api/users') while saving newUser we've got an error= \n
                        ${err}`));
                    });
                });
            }
        })
};
// @route POST api/users/
// @desc saves new user to DB
// @access Public
router.post("/", (req, res) => postCallback(req, res));

module.exports = router;