const db = require("../models/index");
const paging = require("../utils/paging");
const utils = require('../utils/utils')
const Transaction = db.transaction;
const User = db.user;
const Hotel = db.hotel;

exports.create = async (req, res) => {
    try {
        const status = utils.checkStatus(req.body.dateStart, req.body.dateEnd)
        const transaction = new Transaction({
            user: req.body.user,
            hotel: req.body.hotel,
            room: req.body.room,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            price: req.body.price,
            payment: req.body.payment,
            status: status,
            formData: req.body.formData
        });
        const data = await Transaction.createNewTransaction(transaction)
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while creating transaction.",
        });
        console.error(e);
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const { id } = req.params
        const user = await User.getUserById(id)
        const transactions = await Transaction.getTransactions({ user: user.username })

        const data = await Promise.all(transactions.map(async (item) => {
            item.status = utils.checkStatus(item.dateStart, item.dateEnd)
            const hotel = await Hotel.getHotelById(item.hotel)
            return { ...item._doc, hotelName: hotel?.name }
        }))

        const results = paging(data, page, limit);
        if (!!results?.errorMessage) {
            return res.status(400).send(results);
        }
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting transaction.",
        });
        console.error(e);
    }
}

exports.getUnavailableRooms = async (req, res) => {
    try {
        const { dateStart, dateEnd, hotel } = req.body
        const data = await Transaction.getTransactions({ hotel: hotel })
        const updateStatus = data.map((item) => {
            item.status = utils.checkStatus(item.dateStart, item.dateEnd)
            return item._doc
        })
        const checkHotel = updateStatus.filter(item => item.status === "CheckIn" || item.status === "Booked")
        let roomUnavailable = []
        checkHotel.forEach((item) => {
            if (new Date(dateStart).toString() === new Date(item.dateStart).toString()
                || new Date(dateStart).toString() === new Date(item.dateEnd).toString()
                || new Date(dateEnd).toString() === new Date(item.dateStart).toString()
                || new Date(dateEnd).toString() === new Date(item.dateEnd).toString()
                || (new Date(dateStart) > new Date(item.dateStart) && new Date(dateStart) < new Date(item.dateEnd))
                || (new Date(dateEnd) > new Date(item.dateStart) && new Date(dateEnd) < new Date(item.dateEnd))
                || (new Date(dateStart) < new Date(item.dateStart) && new Date(dateEnd) > new Date(item.dateEnd))
            ) {
                roomUnavailable = [...roomUnavailable, ...item.room]
            }
        })
        res.status(200).send(roomUnavailable);
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while creating transaction.",
        });
        console.error(e);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const transactions = await Transaction.getTransactions({}, { createdAt: -1 })

        const data = await Promise.all(transactions.map(async (item) => {
            item.status = utils.checkStatus(item.dateStart, item.dateEnd)
            const hotel = await Hotel.getHotelById(item.hotel)
            return { ...item._doc, hotelName: hotel?.name }
        }))

        const results = paging(data, page, limit);
        if (!!results?.errorMessage) {
            return res.status(400).send(results);
        }
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting transaction.",
        });
        console.error(e);
    }
}

