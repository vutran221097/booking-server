const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Hotel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Hotel', 'Apartments', 'Resorts', 'Villas', 'Cabins'],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photos: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    featured: {
      type: String,
    },
    rooms: [{ type: mongoose.Types.ObjectId, ref: 'Room' }]
  },
  {
    timestamps: true,
  }
);

Hotel.statics = {
  countHotel() {
    return this.countDocuments({});
  },
  createNewHotel(item) {
    return this.create(item);
  },
  getHotelById(id) {
    return this.findById(id).populate('rooms');
  },
  getHotels(condition, sort, limit) {
    return this.find(condition ? condition : {}).populate('rooms').sort(sort ? sort : {}).limit(limit);
  },
  addRoom(idHotel, idRoom) {
    return this.findOneAndUpdate(
      { _id: idHotel },
      { $addToSet: { rooms: idRoom } },
      { new: true }
    );
  },
  updateHotel(id, params) {
    return this.findOneAndUpdate(id, params, { new: true });
  },
  deleteHotel(id) {
    return this.findByIdAndRemove(id);
  },
};

module.exports = mongoose.model("Hotel", Hotel);
