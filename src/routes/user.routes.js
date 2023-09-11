const UserController = require("../controllers/user.controller");
const authJwt = require("../middlewares/authJwt");
const router = require("express").Router();

module.exports = function (app) {

  router.get("/",authJwt.verifyToken, UserController.getAllUsers);

  router.post("/register", UserController.create);

  router.post('/login', UserController.auth)

  app.use("/users", router);
};
