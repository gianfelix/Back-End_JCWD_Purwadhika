import { readFileSync, writeFileSync } from 'fs';

// Helper function untuk membaca data dari JSON file
function loadExpenses() {
  try {
    const data = readFileSync('./expenses.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function untuk menyimpan data ke JSON file
function saveExpenses(expenses) {
  writeFileSync('./expenses.json', JSON.stringify(expenses, null, 2));
}

// Mendapatkan daftar expense
export function getExpenses(req, res) {
  const expenses = loadExpenses();
  res.json(expenses);
}

// Mendapatkan detail expense berdasarkan ID
export function getExpenseById(req, res) {
  const expenses = loadExpenses();
  const expense = expenses.find((expense) => expense.id === req.params.id);

  if (expense) {
    res.json(expense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
}

// Membuat data expense baru
export function createExpense(req, res) {
  const expenses = loadExpenses();

  const newExpense = {
    id: req.body.id,
    name: req.body.name,
    nominal: req.body.nominal,
    category: req.body.category,
  };

  expenses.push(newExpense);
  saveExpenses(expenses);

  res.status(201).json(newExpense);
}

// Mengedit data expense
export function editExpense(req, res) {
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
}

// Menghapus data expense
export function deleteExpense(req, res) {
  const expenses = loadExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === req.params.id);

  if (expenseIndex !== -1) {
    const deletedExpense = expenses.splice(expenseIndex, 1)[0];
    saveExpenses(expenses);

    res.json(deletedExpense);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
}

// Mendapatkan total expense berdasarkan rentang tanggal
export function getTotalExpenseByDateRange(req, res) {
  const { startDate, endDate } = req.query;
  const expenses = loadExpenses();
  const filteredExpenses = expenses.filter(
    (expense) => expense.date >= startDate && expense.date <= endDate
  );
  const totalExpense = filteredExpenses.reduce((total, expense) => total + expense.nominal, 0);
  res.json({ totalExpense });
}

// Mendapatkan total expense berdasarkan kategori
export function getTotalExpenseByCategory(req, res) {
  const expenses = loadExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.category === req.params.category);
  const totalExpense = filteredExpenses.reduce((total, expense) => total + expense.nominal, 0);
  res.json({ totalExpense });
}
