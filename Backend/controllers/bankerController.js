const User = require("../models/userModel");
const Account = require("../models/accountModel");

const getAllCustomers = async (req, res) => {
  try {
    if (req.user?.role !== "banker" && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: { exclude: ["password"] },
    });

    res.json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: error.message });
  }
};

const getCustomerTransactions = async (req, res) => {
  try {
    const customerId = req.params;
    console.log(customerId.id);

    const transactions = await Account.findAll({
      where: { UserId: customerId.id },
    });

    if (!transactions.length) {
      return res
        .status(404)
        .json({ message: "No transactions found for this customer" });
    }

    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

module.exports = { getAllCustomers, getCustomerTransactions };
