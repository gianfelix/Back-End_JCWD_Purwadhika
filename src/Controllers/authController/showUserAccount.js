const db = require("../../models");
const USER = db.User

const showUserAccount = async (req, res) => {
    try {
        const userAll = await USER.findAll(
            {
                attributes: ["user_id","username", "email", "phone", "password", "isverified"],
            }
        );

        return res.status(200).json({ userAll });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

const showUserById = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const user = await USER.findByPk(user_id, {
        attributes: ["user_id", "username", "email", "phone", "password", "isverified"],
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

module.exports = {showUserAccount, showUserById};