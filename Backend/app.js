require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// CORS FIX (frontend: 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// JSON parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use(express.static(`${__dirname}/public`));

// Cookies
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */

const router = require("./src/routes");
app.use("/", router);

/* ---------------- DB CONNECTION ---------------- */

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      autoIndex: true,
    });

    console.log(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}

connectDB();

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

module.exports = app;