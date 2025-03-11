const Account = require("../models/accountModel");

const getTransactions = async (req, res) => {
  try {
    const transactions = await Account.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    const balance = await Account.sum("amount", {
      where: { UserId: req.user.id },
    });

    res.json({ transactions, balance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

const deposit = async (req, res) => {
  try {
    console.log("Deposit request received:", req.body);
    console.log("USERS", req.user);

    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    await Account.create({
      userId: req.user.id,
      type: "deposit",
      amount,
    });

    res.json({ message: "Deposit successful" });
  } catch (error) {
    console.error("Deposit Error:", error);
    res
      .status(500)
      .json({ message: "Error processing deposit", error: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const balance = await Account.sum("amount", {
      where: { UserId: req.user.id },
    });

    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    await Account.create({
      userId: req.user.id,
      type: "withdraw",
      amount: -amount,
    });

    res.json({ message: "Withdrawal successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing withdrawal", error: error.message });
  }
};

module.exports = { getTransactions, deposit, withdraw };
