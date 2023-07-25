const express = require("express");

const {changeAvatarProfile, uploadAvatar } = require("../Controllers/profileController/changeAvatarProfile")

/////////////
const router = express.Router();
router.use(express.json());

/////////////
router.post("/change-avatar",uploadAvatar, changeAvatarProfile );

module.exports = router;