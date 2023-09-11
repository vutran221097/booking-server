const db = require("../models");
const utils = require('../utils/utils')
const paging = require("../utils/paging");

const Room = db.room;
const Hotel = db.hotel;
const Transaction = db.transaction

exports.create = async (req, res) => {
    try {
        const room = new Room({
            title: req.body.title,
            price: req.body.price,
            maxPeople: req.body.maxPeople,
            desc: req.body.desc,
            roomNumbers: req.body.roomNumbers,
            hotel: req.body.hotel
        });

        const newRoom = await Room.createNewRoom(room)
        const hotel = await Hotel.addRoom(newRoom.hotel, newRoom._id)
        if (hotel) {
            res.status(200).send({ newRoom });
        }
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while creating new room.",
        });
        console.error(e);
    }
};

exports.getRooms = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const data = await Room.getRooms()
        const results = paging(data, page, limit);
        if (!!results?.errorMessage) {
            return res.status(400).send(results);
        }
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while creating new room.",
        });
        console.error(e);
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }
        const data = await Room.updateRoom(id, req.body)
        if (data) {
            res.status(200).send({ message: "Update success!" })
        }
    } catch (e) {
        res.status(500).send({
            message: "Error updating room with id=" + id
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const room = await Room.getRoomById(id)
        if (!room.hotel) {
            await Room.deleteRoom(id)
            return res.status(200).send({ message: `Delete success ${id}` })
        }
        const transactions = await Transaction.find({ hotel: room.hotel._id })
        if (!transactions.length) {
            await Room.findByIdAndRemove(id)
            return res.status(200).send({ message: `Delete success ${id}` })
        }
        const updateStatus = transactions.map((item) => {
            item.status = utils.checkStatus(item.dateStart, item.dateEnd)
            return item._doc
        })
        const checkHotel = updateStatus.filter(item => item.status === "CheckIn" || item.status === "Booked")
        const roomUnavailable = []
        checkHotel.forEach((item) => {
            roomUnavailable.push(item.room)
        })
        const formattedArray = roomUnavailable.flat()
        const filterRoom = formattedArray.filter(item => item.roomId === id)
        if (!filterRoom.length) {
            await Room.deleteRoom(id)
            return res.status(200).send({ message: `Delete success ${id}` })
        } else {
            return res.status(400).send({ message: "Room has transactions still working. Can not delete!" })
        }
    } catch (e) {
        res.status(500).send({ message: "Error when deleting room" })
        console.error(e)
    }
};

exports.selectList = async (req, res) => {
    try {
        const rooms = await Room.getRooms()
        const selectListRoom = rooms.map((item) => {
            if (!item.hotel)
                return { value: item._id, name: item.name }
        })
        res.status(200).send(selectListRoom)
    } catch (e) {
        res.status(500).send({ message: "Error when getting room" })
        console.error(e)
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Room.getRoomById(id)
        if (data) {
            res.status(200).send(data)
        }
    } catch (e) {
        res.status(500).send({ message: "Error when getting room" })
        console.error(e)
    }
};
