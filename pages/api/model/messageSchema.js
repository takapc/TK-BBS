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

module.exports =
    mongoose.models.Messages || mongoose.model("Messages", messageSchema);
