const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const keys = require("./config/keys");

const app = express();

mongoose
    .connect(keys.MONGODB_URI)
    .then(() => console.log(`MONGODB IS CONNECTED`))
    .catch(err => console.log(err));

app.use(morgan("dev"));
app.get("/", (req, res) => res.send("hello hey"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER IS LISTENING ON PORT ${PORT}`));