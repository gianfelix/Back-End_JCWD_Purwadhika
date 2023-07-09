const express = require("express");

const {
  validateRegister,
  register,
} = require("../Controllers/authController/postRegister");
const verifyAccount = require("../Controllers/authController/verifyAccount");
const {
  validateLogin,
  loginAccount,
} = require("../Controllers/authController/loginAccount");

const router = express.Router();
router.use(express.json());

router.post("/", validateRegister(), register);
router.patch("/verify", verifyAccount);
router.post("/login", validateLogin(), loginAccount);

module.exports = router;
