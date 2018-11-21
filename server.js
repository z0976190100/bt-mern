const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose
    .connect(keys.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log(`MONGODB IS CONNECTED`))
    .catch(err => console.log(err));

app.use(morgan("dev"));

app.get("/", (req, res) => res.send("hello hey"));

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER IS LISTENING ON PORT ${PORT}`));