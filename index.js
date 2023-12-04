require("dotenv").config();


const httpStatusText = require("./utils/utils");

const express = require("express");

var cors = require("cors");

const mongoose = require("mongoose");

console.log("Process=> ", process.env.MONGO_URL);

const url = process.env.MONGO_URL;
const path = require('path')

mongoose.connect(url).then(() => {
  console.log(`Good Connection Mongodb By Mongoose`);
});


// ! *******************************************************************
const app = express();

app.use(express.json());

const CourseRouter = require("./router/courses.route");
const userRouter = require('./router/users.route')
app.use(cors());

app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use("/api/courses", CourseRouter);
app.use('/api/users',userRouter)

// ! Global Middleware For Not Found Router
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This Resource Is Not Available",
  });
});

// ! Global Error Handler
app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({
      status: error.statusText || httpStatusText.ERROR,
      message: error.message,
      code:error.statusCode,
      data:null,
      From: "From Global Middleware Error",
    });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Opening Port 5000 Listen Now`);
});
