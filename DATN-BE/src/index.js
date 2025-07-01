const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes"); // <== Đúng rồi

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());
routes(app); // <== Gọi ở đây

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
