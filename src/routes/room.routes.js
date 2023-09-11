const RoomController = require("../controllers/room.controller.js");
const authJwt = require("../middlewares/authJwt.js");
const router = require("express").Router();

module.exports = function (app) {
  router.post("/create", RoomController.create);

  router.get("/detail/:id", RoomController.findOne);

  router.put("/update/:id", RoomController.update);

  router.get("/all", RoomController.getRooms);

  router.get("/list-select", RoomController.selectList);

  router.delete("/delete/:id", RoomController.delete);

  app.use("/rooms", router);
};
