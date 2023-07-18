const path = require("path");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const USER = require("../../models/users");
const bcrypt = require("bcrypt");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const sendMailPhone = require("./sendMailPhone");

const validationChangePhone = () => {
  return [
    body("oldPhone")
      .isLength({ min: 3, max: 20 })
      .withMessage("Phone must be between 3 and 20 characters"),
    body("newPhone")
      .isLength({ min: 3, max: 20 })
      .withMessage("Phone must be between 3 and 20 characters"),
  ];
};

const changePhoneAccount = async (req, res) => {
  const { oldPhone, newPhone } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Invalid tokens" });
  }

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  let user_id
  try {
    const decodedToken = JWT.verify(token, JWT_KEY);
    user_id = decodedToken.user_id;
    console.log(user_id)
  } catch (err) {
    return res.status(400).json({ error: "Invalid tokens" });
  }

  try {
    const user = await USER.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(400).json({ error: "User invalid" });
    }

    if (user.phone !== oldPhone) {
      return res.status(400).json({ error: "Phone not match" });
    }

    const userUpdate = await USER.update(
      {
        phone: newPhone,
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );

    await sendMailPhone(user.email);

    return res.status(200).json({
      message: "Change phone number success with new phone",
      userUpdate,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });

  }
};



module.exports = {
  validationChangePhone,
  changePhoneAccount
}