require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// CORS (allow frontend on 5173)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files
app.use(express.static(`${__dirname}/public`));

// Cookies
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */

const router = require("./src/routes");
const otpRoutes = require("./src/routes/otpRoutes");
app.use("/", router);
app.use("/otp", otpRoutes);

/* ---------------- DB CONNECTION ---------------- */

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );

    const seedAdmin = require("./src/utils/seedAdmin");
    await seedAdmin();
  } catch (error) {
    console.error("MONGODB connection FAILED:", error);
    process.exit(1);
  }
};

connectDB();

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 4000;

// ✅ FINAL FIX (important)
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

module.exports = app;
