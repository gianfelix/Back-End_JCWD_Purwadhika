// // import { expenseRouter } from './Routers/expenseRouter.js';

// import { resolve } from 'path';
// require('dotenv').config({
//     path: resolve(__dirname, '../.env')
// });
// import express, { json } from 'express';
// const PORT = process.env.PORT || 8000;

// import { expenseRouter } from './Routers/expenseRouter.js'; 

// const app = express();
// app.use(json())

// app.use("/api/expense-management", expenseRouter)

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// })

import express, { json } from 'express';
import { readFileSync, writeFileSync } from 'fs';

const app = express();
app.use(json());

const dataFilePath = './db/json-server.json';

// Get expense list
app.get('/expenses', (req, res) => {
  const expenses = loadExpenses();
  res.json(expenses);
});

// Get expense details
app.get('/expenses/:id', (req, res) => {
  const expenses = loadExpenses();
  const expense = expenses.find((expense) => expense.id === req.params.id);

  if (expense) {
    res.json(expense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

// Create new expense data
app.post('/expenses', (req, res) => {
  const expenses = loadExpenses();

  const newExpense = {
    id: generateId(),
    name: req.body.name,
    nominal: req.body.nominal,
    category: req.body.category,
  };

  expenses.push(newExpense);
  saveExpenses(expenses);

  res.json(newExpense);
});

// Edit expense data
app.put('/expenses/:id', (req, res) => {
  const expenses = loadExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === req.params.id);

  if (expenseIndex !== -1) {
    expenses[expenseIndex].name = req.body.name;
    expenses[expenseIndex].nominal = req.body.nominal;
    expenses[expenseIndex].category = req.body.category;

    saveExpenses(expenses);

    res.json(expenses[expenseIndex]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

// Delete expense data
app.delete('/expenses/:id', (req, res) => {
  const expenses = loadExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === req.params.id);

  if (expenseIndex !== -1) {
    const deletedExpense = expenses.splice(expenseIndex, 1)[0];
    saveExpenses(expenses);

    res.json(deletedExpense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

// Get total expense by date range
app.get('/expenses/total', (req, res) => {
  const { startDate, endDate } = req.query;
  const expenses = loadExpenses();
  const filteredExpenses = expenses.filter(
    (expense) => expense.date >= startDate && expense.date <= endDate
  );
  const totalExpense = filteredExpenses.reduce((total, expense) => total + expense.nominal, 0);
  res.json({ totalExpense });
});

// Get total expense by category
app.get('/expenses/total/:category', (req, res) => {
  const expenses = loadExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.category === req.params.category);
  const totalExpense = filteredExpenses.reduce((total, expense) => total + expense.nominal, 0);
  res.json({ totalExpense });
});

// Helper function to load expenses from JSON file
function loadExpenses() {
    try {
        const data = readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        // res.send('data', data)
        return ['test masuk'];
    }
}


// Helper function to save expenses to JSON file
function saveExpenses(expenses) {
  writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
}

// Helper function to generate a unique ID for expenses
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
