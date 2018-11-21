const express = require("express");
const router = express.Router();

// @route GET api/profiles/test
// @desc tests route
// @access Public
router.get("/test", (req, res) => res.json({msq: "profiles GET WORKS"}));

module.exports = router;