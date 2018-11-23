const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: "users" // "users" ?
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    employment: {
        type: String,
        required: true
    },
    contacts: [
        {
            phonenumber: {
                type: String,
                default: "no phonenumber"
            },

        }
    ]
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);