// import express from "express";
// import  jwt  from "jsonwebtoken";

// const verifyAccount = express.Router();
// verifyAccount.use(express.json());

// const users = []; // empty array store

// verifyAccount.patch("/api/auth/verify/:token", (req, res) => {
//   const token = req.params.token; // mendapatkan token

//   try {
//     const decoded = jwt.verify(token, "your-secret-key"); // Verify token

//     const user = users.find((user) => user.email === decoded.email);
//     if (!user) {
//       return res.status(400).json({ success: false, err: "User not found" });
//     }

//     if (user.isVerified) {
//       return res
//         .status(400)
//         .json({ success: false, err: "Account already verified" });
//     }

//     user.isVerified = true;
//     res.json({ success: true, message: "Account verified" });
//   } catch (err) {
//     res.status(400).json({ success: false, err });
//   }
// });

// export default verifyAccount;

import express from "express";
const verifyAccount = express.Router();

const verifTokens = {};

// define token code
const tokenExample =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

verifTokens[tokenExample] = {
  used: false,
};

verifyAccount.patch("/api/auth/verify", (req,res) => {
  try{
    const token = req.headers.authorization.replace("Bearer ","");

    if(!verifTokens[token] || verifTokens[token].used) {
      return res.status(401).json({ success: false, err: "Invalid token", message: "Token is invalid" });
    }

    verifTokens[token].used = true;
    return res.status(200).json({ success: true, message: "Token verified" });

  } catch(err){
    console.log(err);
    return res.status(400).json({ success: false, err, message: "ERROR" });
  }
})

export default verifyAccount