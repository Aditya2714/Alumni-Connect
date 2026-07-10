const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

router.use(checkAuth);

router.post("/recommendations", async (req, res) => {
  try {
    const { topN, algorithm } = req.body;
    let endpoint = "/recommend";

    if (algorithm === "knn") endpoint = "/recommend/knn";
    else if (algorithm === "combined") endpoint = "/recommend/combined";

    const response = await fetch(`${ML_SERVICE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: req.user._id, topN: topN || 10 }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("ML service error:", error);
    return res.status(500).json({ status: "fail", message: "ML service unavailable" });
  }
});

module.exports = router;
