const TransactionController = require("../controllers/transaction.controller");
const router = require("express").Router();
const authJwt = require('../middlewares/authJwt')

module.exports = function (app) {
  router.get("/user/:id", TransactionController.getUserTransactions);

  router.post("/create", TransactionController.create);

  router.get("/latest", TransactionController.getAllTransactions);

  router.post('/unavailable-rooms', TransactionController.getUnavailableRooms)

  app.use("/transactions", router);
};
