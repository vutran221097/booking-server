const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transaction = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    hotel: {
      type: String,
      required: true,
    },
    room: [{
      roomId: String,
      room: Number,
      day: Number,
    }],
    dateStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,

    },
    payment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Booked", "CheckIn", "CheckOut"],
    },
    formData: {
      fullname: String,
      email: String,
      phoneNumber: String,
      identityCardNumber: String
    }
  },
  {
    timestamps: true,
  }
);

Transaction.statics = {
  countTransaction() {
    return this.countDocuments({});
  },
  createNewTransaction(item) {
    return this.create(item);
  },
  getTransactionById(id) {
    return this.findById(id);
  },
  getTransactions(condition, sort) {
    return this.find(condition ? condition : {}).sort(sort ? sort : {});
  },
  updateTransaction(id, params) {
    return this.findOneAndUpdate(id, params, { new: true });
  },
  deleteTransaction(id) {
    return this.findByIdAndRemove(id);
  },
};

module.exports = mongoose.model("Transaction", Transaction);
