// const nodemailer = require("nodemailer");

// const sendMailRegister = async (email, token) => {
//   const porter = nodemailer.createTransport({
//     service: "hotmail",
//     auth: {
//       user: process.env.user_Hotmail,
//       pass: process.env.pass_Hotmail,
//     },
//   });

//   const settingsEmail = {
//     from: process.env.user_Hotmail,
//     to: email,
//     subject: "Register Account",
//     html: `<html>
//         <body>
//           <h1>Register New Account</h1>
//           <p>Hello, ${req.body.username}</p>
//           <p>Thank you for registering!</p>
//           <p>Please click the link below to verify your account:</p>
//           <a href="http://localhost:3000/verify-account/${token}"
//             style="display: inline-block;
//             background-color: #4CAF50;
//             border: none;
//             color: white;
//             padding: 10px 20px;
//             text-align: center;
//             text-decoration: none;
//             display: inline-block;
//             font-size: 16px;
//             margin: 4px 2px;
//             cursor: pointer;">Verify Account</a>
//           <p>Thank you!</p>
//           <p>Regards,</p>
//           <p>Gian Felix Ramadan</p>
//         </body>
//       </html>`,
//   };

//   await porter.sendMail(settingsEmail);
// };

// module.exports = sendMailRegister;
