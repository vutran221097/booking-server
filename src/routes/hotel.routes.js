const HotelController = require("../controllers/hotel.controller.js");
const authJwt = require('../middlewares/authJwt')
const router = require("express").Router();

module.exports = function (app) {
  router.post("/create", HotelController.create);

  router.get("/all", HotelController.getHotels);

  router.get("/list-select", HotelController.selectList);

  router.get("/city", HotelController.getAllHotelByCity);

  router.get("/type", HotelController.getAllHotelByType);

  router.get("/top-rated", HotelController.getTopRated);

  router.get("/detail/:id", HotelController.findOne);

  router.post("/search", HotelController.searchHotels);

  router.post("/hotel-list", HotelController.getHotelByCondition);

  router.put("/update/:id", HotelController.update);

  router.delete('/delete/:id', HotelController.delete)

  app.use("/hotels", router);
};
