// const verifyAccount = express.Router();

const verifTokens = {};

// Define token code
const tokenExample =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

verifTokens[tokenExample] = {
  used: false,
};

verifyAccount = (req,res) => {
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
}

module.exports = verifyAccount