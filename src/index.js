import express from "express";
import registAccount from "./POST/registerAccount.js";
import loginAccount from "./POST/loginAccount.js";
import verifyAccount from "./PATCH/verifyAccount.js";


const app = express();
const port = 8000;

app.use("/", registAccount); // Register Account
app.use("/", verifyAccount); // Verify Account
app.use("/", loginAccount); // Login Account

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});