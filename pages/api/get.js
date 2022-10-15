require("dotenv").config();

const mongoose = require("mongoose");
const connectOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose.connect(
    `mongodb+srv://taka:${process.env.NEXT_PUBLIC_DB_PASSWORD}@cluster0.zicemzi.mongodb.net/?retryWrites=true&w=majority`,
    connectOption
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", () => console.log("DB connection successful"));

var Message = require("./model/messageSchema");

export default function handler(req, res) {
    try {
        Message.find({}, function (err, docs) {
            res.status(200).json({ docs });
            res.end();
        });
    } catch (error) {
        res.json(error);
        res.status(405).end();
    }
}
