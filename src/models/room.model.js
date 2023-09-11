const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Room = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    maxPeople: {
      type: Number,
    },
    desc: {
      type: String,
    },
    roomNumbers: {
      type: [{ type: Number }],
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel'
    }
  },
  {
    timestamps: true,
  }
);

Room.statics = {
  countRoom() {
    return this.countDocuments({});
  },
  createNewRoom(item) {
    return this.create(item);
  },
  getRoomById(id) {
    return this.findById(id).populate('hotel', 'name');
  },
  getRooms(condition, sort, limit) {
    return this.find(condition ? condition : {}).populate('hotel', 'name').sort(sort ? sort : {}).limit(limit);
  },
  updateRoom(id, params) {
    return this.findOneAndUpdate(id, params, { new: true });
  },
  deleteRoom(id) {
    return this.findByIdAndRemove(id);
  },
};

module.exports = mongoose.model("Room", Room);
