const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello");
});
mongoose
  .connect(
    // `mongodb+srv://dungldph38549: ${process.env.MONGO_DB}@cluster0.gyc0fo3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    `${process.env.MONGO_DB}`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
