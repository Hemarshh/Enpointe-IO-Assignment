const express = require("express");
const {
  getTransactions,
  deposit,
  withdraw,
} = require("../controllers/customerController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/transactions", authMiddleware, getTransactions);
router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);

module.exports = router;
