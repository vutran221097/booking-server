const bcrypt = require("bcryptjs");

const adminItem = {
    username: "admin",
    password: bcrypt.hashSync("123456", 8),
    phoneNumber: "0987216425",
    fullName: "tran vu",
    email: "tranvu221097@gmail.com",
    isAdmin: true,
}

module.exports = adminItem