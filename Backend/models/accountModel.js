const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Account = sequelize.define(
  "Account",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    type: { type: DataTypes.ENUM("deposit", "withdrawal"), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { timestamps: true }
);

User.hasMany(Account, { foreignKey: "userId", onDelete: "CASCADE" });
Account.belongsTo(User, { foreignKey: "userId" });

module.exports = Account;
