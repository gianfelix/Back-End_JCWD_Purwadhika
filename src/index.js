const path = require("path");
const authRouter = require("./Routers/authRouter");
const profilingRouter = require("./Routers/profilingRouter");
const bloggerRouter = require("./Routers/bloggerRouter");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const port = process.env.PORT;

const app = express();

app.use("/api-felix/auth", authRouter);
app.use("/api-felix/profiling", profilingRouter);
app.use("/api-felix/blogger", bloggerRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});