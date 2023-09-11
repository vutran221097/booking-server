const db = require("../models/index");
const utils = require('../utils/utils')

const Transaction = db.transaction
const User = db.user

exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countUser()
        const totalTransaction = await Transaction.countTransaction()
        const earning = await Transaction.getTransactions()
        const updateStatus = earning.map((item) => {
            item.status = utils.checkStatus(item.dateStart, item.dateEnd)
            return item._doc
        })
        const transactionDone = updateStatus.filter((item) => item.status === "CheckOut")
        const totalEarning = !transactionDone.length ? 0 : transactionDone.length === 1 ? transactionDone[0].price : transactionDone.reduce((a, b) => a.price + b.price)
        const totalBalance = 100

        const data = {
            totalUsers,
            totalTransaction,
            totalEarning,
            totalBalance,
        }
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: "Some error occurred while getting dashboard.",
        });
        console.error(e);
    }
};
