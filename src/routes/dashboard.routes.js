const DashboardController = require("../controllers/dashboard.controller.js");
const authJwt = require("../middlewares/authJwt.js");
const router = require("express").Router();

module.exports = function (app) {
    router.get("/", DashboardController.getDashboard);
    app.use("/dashboard", router);
};
