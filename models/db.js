const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Connect to the MongoDB cluster
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_SECURE}@test.ottu2.mongodb.net/?retryWrites=true&w=majority&appName=test`,
      {
        dbName: "e-commerce", // Replace with your desired database name
      }
    );
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

module.exports = connectDB;
