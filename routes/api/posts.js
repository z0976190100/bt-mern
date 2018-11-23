const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Post = require("../../models/Post");

const postHelpers = {
    createPost: (req, res) => {
        //TODO: validation of received data
        // const {errors, isValid} = validateRegistrationData(req.body);
        // if (!isValid) {
        //     return res.status(400).json(errors);
        // }

        const errors = [];
        const id = req.user.id;
        const {content, name, avatar} = req.body;
        const newPost = new Post(
            {
                _user: id,
                content,
                name,
                avatar
            }
        );
        newPost.save()
            .then(post => {
                res.json(post);
            })
            .catch(err => {
                console.log(
                    `\n < posts.js:29 > ERROR: IN savePost. While saving newPost we've got \n
                        ${err}`);
                return res.status(400).json(err);
            });
    }
};

// @route POST api/posts/
// @desc creates new post
// @access Private
router.post(
    "/",
    passport.authenticate("jwt", {session: false}),
    (req, res) => postHelpers.createPost(req, res));

// @route DELETE api/users/
// @desc removes user and profile
// @access Private
router.post(
    "/",
    passport.authenticate("jwt", {session: false}),
    (req, res) => deleteHelpers.deleteUser(req, res));

// @route GET api/posts/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "posts GET WORKS"}));

module.exports = router;