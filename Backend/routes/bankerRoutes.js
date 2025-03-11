const express = require("express");
const {
  getAllCustomers,
  getCustomerTransactions,
} = require("../controllers/bankerController");

const authMiddleware = require("../middlewares/authMiddleware");
const bankerRouter = express.Router();

bankerRouter.get("/customers", authMiddleware, getAllCustomers);
bankerRouter.get("/customer/:id", authMiddleware, getCustomerTransactions);

module.exports = bankerRouter;
