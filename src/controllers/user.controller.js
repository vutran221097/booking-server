const db = require("../models/index");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const paging = require("../utils/paging");

exports.create = async (req, res) => {
  try {
    // Create a user
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      isAdmin: req.body.isAdmin ? req.body.isAdmin : false
    });

    const checkDuplicate = await User.getUser({ username: req.body.username });
    if (checkDuplicate) {
      return res.status(400).send({ message: "Username already exists!" });
    }

    const data = await User.createNewUser(user);
    if (data) {
      let newData = { ...data._doc }
      delete newData["password"]
      res.status(200).send(newData);
    }
  } catch (e) {
    res.status(500).send({
      message: "Some error occurred while creating the user.",
    });
    console.error(e);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const data = await User.getAllUsers();
    const results = paging(data, page, limit);
    if (!!results?.errorMessage) {
      return res.status(400).send(results);
    }
    res.status(200).send(results);
  } catch (e) {
    res.status(500).send({
      message: "Some error occurred while geting the users.",
    });
    console.error(e);
  }
};

exports.findOne = (req, res) => {
  try {
    const id = req.params.id;
    const data = User.getUserById(id)
    if (data) {
      res.status(200).send(data)
    }
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving user with id=" + id,
    });
    console.error(e);
  }
};

exports.auth = async (req, res) => {
  try {
    const user = await User.getUser({ username: req.body.username })
    if (!user) {
      return res.status(404).send({
        message: "Không tìm thấy tài khoản."
      });
    } else {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Nhập sai mật khẩu"
        });
      }

      const token = jwt.sign({
        id: user._id
      }, process.env.SECRET_TOKEN || "bookingappsecrettoken", {
        expiresIn: 604800 // 1 hour
      });

      let newUser = { ...user._doc }
      delete newUser['password']
      delete newUser['createdAt']
      delete newUser['updatedAt']
      delete newUser['__v']

      const response = {
        user: newUser,
        accessToken: token,
      }

      return res.status(200).send(response);
    }
  } catch (e) {
    res.status(401).send({ message: "Login failed!" })
    console.error(e);
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await User.deleteUser(id)
    res.status(200).send({ message: `Delete success user ${id}` })
  } catch (e) {
    res.status(500).send({
      message: "Could not delete user with id=" + id,
    });
    console.error(e);
  }
};
