const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    _user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    content: {
        type: String,
        required: true
    },
    name: {
      type: String
    },
   avatar: {
        type: String
    },
    date: {
      type: Date,
      default: Date.now()
    },
    likes: [
        {
            _user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
        },
    ],
    comments: [
        {
            _user: {
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            content: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            },
        },
    ]
});

module.exports = Post = mongoose.model("posts", PostSchema);