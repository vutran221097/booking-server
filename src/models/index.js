const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require("./user.model");
db.hotel = require("./hotel.model");
db.room = require("./room.model");
db.transaction = require("./transaction.model");

module.exports = db;
