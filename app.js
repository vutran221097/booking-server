const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;
const db = require("./src/models/index");
const User = db.user
const adminItem = require('./src/constants/userAdmin')

db.mongoose
  .connect("mongodb://127.0.0.1:27017/BookingApp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(async () => {
    try {
      const checkAdmin = await User.getUser({ username: "admin" });
      if (checkAdmin) return;
      else {
        await User.createNewUser(adminItem);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  })
  .catch((err) => {
    console.log("Cannot connect to the MongoDB!", err);
    process.exit();
  });

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use('/images', express.static('images'));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Back End chạy thành công");
});

//routes
require("./src/routes/user.routes")(app);
require("./src/routes/hotel.routes")(app);
require("./src/routes/room.routes")(app);
require("./src/routes/transaction.routes")(app);
require("./src/routes/dashboard.routes")(app);

// 404 not found route
app.use((req, res, next) => {
  res.status(404).send({
    errorMessage: "Route not found",
  });
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
