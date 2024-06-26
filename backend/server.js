const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const ExpressError = require("./uitls/ExpressError.js");
const path = require("path");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8070;

app.use(
  cors({
    origin: ["http://localhost:1234"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 
app.use(express.static(path.join(__dirname, "/public"))); 

// const URL = process.env.MONGODB_URI;
const URL = "mongodb://127.0.0.1:27017/hotel-scalar";

mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection Success!");
});

const hotelRoute = require("./routes/hotel_route");

app.get("/", (req, res) => {
  res.send("Hotel Management Backend Server");
});

app.use("/hotel", hotelRoute);

//page not found!
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).json({ message });

});

app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
