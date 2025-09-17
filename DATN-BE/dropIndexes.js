const mongoose = require("mongoose");
require("dotenv").config(); // đọc file .env

async function dropIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_DB);

    const result = await mongoose.connection.db
      .collection("orders")
      .dropIndexes();

    console.log("Dropped indexes:", result);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error dropping indexes:", err.message);
  }
}

dropIndexes();
