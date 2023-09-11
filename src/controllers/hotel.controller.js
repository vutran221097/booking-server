const db = require("../models/index");
const utils = require('../utils/utils')
const cityImg = require('../constants/cityImage')
const hotelType = require('../constants/hotelType')
const detailImage = require('../constants/detailImage');
const paging = require("../utils/paging");

const Hotel = db.hotel;
const Transaction = db.transaction

exports.create = async (req, res) => {
    try {
        const hotel = new Hotel({
            name: req.body.name,
            type: req.body.type,
            city: req.body.city,
            address: req.body.address,
            distance: req.body.distance,
            photos: req.body.photos,
            desc: req.body.desc,
            rating: Number(req.body.rating).toFixed(1).toString(),
            featured: req.body.featured
        });
        const data = await Hotel.createNewHotel(hotel)
        if (data) {
            res.status(200).send(data);
        }
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while creating hotel.",
        });
        console.error(e);
    }
};

exports.getHotels = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const data = await Hotel.getHotels()
        const results = paging(data, page, limit);
        if (!!results?.errorMessage) {
            return res.status(400).send(results);
        }
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting hotels.",
        });
        console.error(e);
    }
};

exports.getAllHotelByCity = async (req, res) => {
    try {
        const ha_noi = await Hotel.getHotels({ city: { $regex: new RegExp('Ha Noi'), $options: 'i' } })
        const ho_chi_minh = await Hotel.getHotels({ city: { $regex: new RegExp('Ho Chi Minh'), $options: 'i' } })
        const da_nang = await Hotel.getHotels({ city: { $regex: new RegExp('Da Nang'), $options: 'i' } })

        res.status(200).send([
            {
                city: "Ha Noi",
                img: cityImg.haNoi,
                totalHotels: ha_noi.length
            },
            {
                city: "Ho Chi Minh",
                img: cityImg.hoChiMinh,
                totalHotels: ho_chi_minh.length
            },
            {
                city: "Da Nang",
                img: cityImg.daNang,
                totalHotels: da_nang.length
            },
        ])

    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting hotels.",
        });
        console.error(e);
    }
};

exports.getAllHotelByType = async (req, res) => {
    try {
        const type = hotelType.hotelType
        const image = hotelType.typeImg
        const totalData = []

        await Promise.all([Hotel.getHotels({ type: 'Hotel' }), Hotel.getHotels({ type: 'Apartments' }), Hotel.getHotels({ type: 'Resorts' }), Hotel.getHotels({ type: 'Villas' }), Hotel.getHotels({ type: 'Cabins' })]).then(result => {
            result.map(item => {
                totalData.push(item.length)
            })
        })

        const data = type.map((item, index) => {
            return { type: item, img: image[index], total: totalData[index] }
        })
        res.status(200).send(data)

    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting hotels.",
        });
        console.error(e);
    }
};

exports.getTopRated = async (req, res) => {
    try {
        const data = await Hotel.getHotels({}, { rating: -1 }, 3)
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting hotels.",
        });
        console.error(e);
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Hotel.getHotelById(id)
        if (data) {
            const newData = { ...data._doc, img: detailImage.detailImage }
            res.status(200).send(newData)
        }
    } catch (e) {
        res.status(500).send({ message: "Error retrieving Hotel with id=" + id });
        console.error(e);
    }
};

exports.searchHotels = async (req, res) => {
    try {
        const { city, dateStart, dateEnd, maxPeople } = req.body
        const hotel = await Hotel.getHotels({ city: { $regex: new RegExp(city), $options: 'i' } })
        const filterHotel = []
        await Promise.all(hotel.map(async (item) => {
            if (maxPeople > item.maxPeople) return;
            const transactions = await Transaction.getTransactions({ hotel: item._id })
            const updateStatus = transactions.map((item) => {
                item.status = utils.checkStatus(item.dateStart, item.dateEnd)
                return item._doc
            })
            const checkHotel = updateStatus.filter(item => item.status === "CheckIn" || item.status === "Booked")
            const roomUnavailable = []
            checkHotel.forEach(i => {
                if (
                    new Date(dateStart).toString() === new Date(i.dateStart).toString()
                    || new Date(dateStart).toString() === new Date(i.dateEnd).toString()
                    || new Date(dateEnd).toString() === new Date(i.dateStart).toString()
                    || new Date(dateEnd).toString() === new Date(i.dateEnd).toString()
                    || (new Date(dateStart) > new Date(i.dateStart) && new Date(dateStart) < new Date(i.dateEnd))
                    || (new Date(dateEnd) > new Date(i.dateStart) && new Date(dateEnd) < new Date(i.dateEnd))
                    || (new Date(dateStart) < new Date(i.dateStart) && new Date(dateEnd) > new Date(i.dateEnd))
                ) {
                    roomUnavailable.push(i.room)
                }
            })
            const formattedArray = roomUnavailable.flat()
            let totalRoom = 0
            item.rooms.forEach(item => {
                totalRoom += item.roomNumbers.length
            })
            if (formattedArray.length === totalRoom) return;
            filterHotel.push(item)
        }))
        res.status(200).send(filterHotel)
    } catch (e) {
        res.status(500).send({ message: "Error when searching hotel" })
        console.error(e);
    }
}

exports.getHotelByCondition = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const { type, param } = req.body

        if (type === 'all' && param === 'all') {
            const data = await Hotel.getHotels({})
            const results = paging(data, page, limit);
            if (!!results?.errorMessage) {
                return res.status(400).send(results);
            }
            res.status(200).send(results);
            return
        }

        const data = await Hotel.getHotels({ [type]: { $regex: new RegExp(param), $options: 'i' } })

        const results = paging(data, page, limit);
        if (!!results?.errorMessage) {
            return res.status(400).send(results);
        }
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send({ message: "Error when getting hotel" })
        console.error(e);
    }
}

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }
        const data = await Hotel.updateHotel(id, req.body)
        if (data) {
            res.status(200).send({ message: "Update success!" })
        }
    } catch (e) {
        res.status(500).send({
            message: "Error updating hotel with id=" + id
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const transactions = await Transaction.find({ hotel: id })
        if (!transactions.length) {
            await Hotel.findByIdAndRemove(id)
            return res.status(200).send({ message: `Delete success ${id}` })
        }
        const updateStatus = transactions.map((item) => {
            item.status = utils.checkStatus(item.dateStart, item.dateEnd)
            return item._doc
        })
        const checkHotel = updateStatus.filter(item => item.status === "CheckIn" || item.status === "Booked")
        if (checkHotel.length) {
            return res.status(400).send({ message: "Hotel has transactions still working. Can not delete!" })
        } else {
            await Hotel.findByIdAndRemove(id)
            return res.status(200).send({ message: `Delete success ${id}` })
        }
    } catch (e) {
        res.status(500).send({ message: "Error when deleting hotel" })
        console.error(e)
    }
};

exports.selectList = async (req, res) => {
    try {
        const hotels = await Hotel.getHotels()
        const selectListHotel = hotels.map((item) => {
            return { value: item._id, name: item.name }
        })
        res.status(200).send(selectListHotel)
    } catch (e) {
        res.status(500).send({ message: "Error when getting hotel" })
        console.error(e)
    }
};
