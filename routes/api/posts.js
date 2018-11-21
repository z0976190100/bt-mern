const express = require("express");
const router = express.Router();

// @route GET api/posts/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "posts GET WORKS"}));

module.exports = router;