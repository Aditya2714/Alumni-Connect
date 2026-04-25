const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

console.log("loginRoute loaded");


router.post("/login", loginController);

module.exports = router;