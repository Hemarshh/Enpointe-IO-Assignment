const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

// router.get("/register", (req, res) => {
//   console.log("hello");
// });

module.exports = router;
