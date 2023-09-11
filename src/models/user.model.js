const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true
    },
    password: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
        "invalid email"
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

User.statics = {
  countUser() {
    return this.countDocuments({});
  },
  createNewUser(item) {
    return this.create(item);
  },
  getUserById(id) {
    return this.findById(id);
  },
  getUser(condition) {
    return this.findOne(condition);
  },
  getAllUsers(condition) {
    return this.find(condition ? condition : {});
  },
  updateUser(id, params) {
    return this.findOneAndUpdate(id, params, { new: true });
  },
  deleteUser(id) {
    return this.findByIdAndRemove(id);
  },
};

module.exports = mongoose.model("User", User);
