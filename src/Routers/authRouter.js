const express = require("express");

////////////////
const {
  register,
  validateRegister,
} = require("../Controllers/authController/registerAccount");

const verifyAccount = require("../Controllers/authController/verifyAccount");

const {
  validationLogin,
  loginAccount,
} = require("../Controllers/authController/loginAccount");

const keepLoginAccount = require("../Controllers/authController/keepLoginAccount");

const {
  forgotPasswordAccount,
  validationForgotPass,
} = require("../Controllers/authController/forgotPasswordAccount");

const {
  resetPasswordAccount, validationResetPass,
} = require("../Controllers/authController/resetPasswordAccount");

const {
  validationChangePasword,
    changePasswordAccount 
} = require("../Controllers/authController/changePasswordAccount");

/////////////
const router = express.Router();
router.use(express.json());

/////////////
router.post("/", validateRegister(), register);
router.patch("/verif-account", verifyAccount);
router.post("/login", validationLogin(), loginAccount);
router.get("/", keepLoginAccount);
router.put("/forgot-password", validationForgotPass(), forgotPasswordAccount);
router.patch("/reset-password", validationResetPass(), resetPasswordAccount);
router.patch("/change-password", validationChangePasword(), changePasswordAccount);

module.exports = router;
