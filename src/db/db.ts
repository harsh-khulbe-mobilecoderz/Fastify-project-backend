const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function dbConnect() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("DB Connected successfully")
    }).catch((err:any) => {
        console.log(err);
    })
}

module.exports = dbConnect;