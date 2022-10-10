const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config();

const mongoose = require("mongoose");
const connectOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose.connect(
    `mongodb+srv://taka:` +
        process.env.DB_PASSWORD +
        `@cluster0.zicemzi.mongodb.net/?retryWrites=true&w=majority`,
    connectOption
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error:"));
db.once("open", () => console.log("DB connection successful"));

var Message = require("./model/messageSchema");

const app = express();
const allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, access_token"
    );

    // intercept OPTIONS method
    if ("OPTIONS" === req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export default function handler(req, res) {
    let data = new Message({
        id: req.body.id,
        name: req.body.name,
        content: req.body.content,
        created: req.body.created,
    });
    data.save(function (err) {
        if (err) return handleError(err); // saved!
    });
    res.status(200).json(req.body);
}
