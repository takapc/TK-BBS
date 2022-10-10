const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    content: {
        type: String,
    },
    created: {
        type: Date,
    },
});

exports.Message = mongoose.model("Chat", messageSchema);
