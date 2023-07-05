const path = require("path")
require("dotenv").config({
    path: path.resolve(__dirname,"../.env")
});
const express=require('express');
const PORT = process.env.PORT || 8000;

const {
    expenseRouter
} = require("./Routers")

const app = express();
app.use(express.json());

app.use("/api/expense-management", expenseRouter)


// middleware
app.use((req, res, next) => {
    console.log("Time:", Date.now());
    next();
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})