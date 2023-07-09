const express = require("express");
const router = express.Router();

const {
    getExpense,
    getExpenseById,
    createExpense,
    editExpense,
    deleteExpense,
    totalExpense
} = require("../Controllers/expenseController");

router.get("/expense", getExpense);
router.get("/expense/:expenseId", getExpenseById);
router.get("/expense-amounts", totalExpense)
router.post("/expense", createExpense);
router.patch("/expense/:expenseId", editExpense);
router.delete("/expense/:expenseId", deleteExpense);

module.exports = router;