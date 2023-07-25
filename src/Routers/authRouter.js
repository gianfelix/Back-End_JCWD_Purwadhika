const express = require("express");

//////////////// IMPORT
const registerAccount = require("../Controllers/authController/registerAccount");
const validationRegister = require("../Controllers/validator/validationRegister");

const verifyAccount = require("../Controllers/authController/verifyAccount");

const loginAccount = require("../Controllers/authController/loginAccount");
const validationLogin = require("../Controllers/validator/validationLogin");

const keepLoginAccount = require("../Controllers/authController/keepLoginAccount");

const forgotPasswordAccount = require("../Controllers/authController/forgotPasswordAccount");
const validationForgotPass = require("../Controllers/validator/validationForgotPass");

const resetPasswordAccount = require("../Controllers/authController/resetPasswordAccount");
const validationResetPass = require("../Controllers/validator/validationResetPass");

const changePasswordAccount = require("../Controllers/authController/changePasswordAccount");
const validationChangePassword = require("../Controllers/validator/validationChangePassword");

const changeUsernameAccount = require("../Controllers/authController/changeUsernameAccount");
const validationChangeUsername = require("../Controllers/validator/validationChangeUsername");

const changePhoneAccount = require("../Controllers/authController/changePhoneAccount");
const validationChangePhone = require("../Controllers/validator/validationChangePhone");

const changeEmailAccount = require("../Controllers/authController/changeEmailAccount");
const validationChangeEmail = require("../Controllers/validator/validationChangeEmail");

const {showUserAccount, showUserById} = require("../Controllers/authController/showUserAccount");

///////////// IMPORT index.js
const router = express.Router();
router.use(express.json());

///////////// EKSPORT REQUEST TO POSTMAN
router.post("/", validationRegister(), registerAccount);
router.patch("/verif-account", verifyAccount);
router.post("/login", validationLogin(), loginAccount);
router.get("/", keepLoginAccount);
router.put("/forgot-password", validationForgotPass(), forgotPasswordAccount);
router.patch("/reset-password", validationResetPass(), resetPasswordAccount);
router.patch("/change-password", validationChangePassword(), changePasswordAccount);
router.patch("/change-username", validationChangeUsername(), changeUsernameAccount);
router.patch("/change-phone", validationChangePhone(), changePhoneAccount);
router.patch("/change-email", validationChangeEmail(), changeEmailAccount);
router.get("/show-users", showUserAccount);
router.get("/show-users/:user_id", showUserById);

module.exports = router;
