const express = require("express");
const router = express.Router();
const axiosURL = process.env.JSON_SERVER_URL;
const axios = require("axios");

router.get("/list", async (req, res) => {
  try {
    const result = await axios.get(`${axiosURL}/user`);
    if (result.data.length > 0) {
      console.log(result.data);
      res.status(200).json(result.data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//// details
router.get("/list/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const respon = await axios.get(`${axiosURL}/user/${id}`);
    res.send(respon.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

// router.get("/details", (req, res) => {
//     res.send("Details")
// })

/////////////// create
// router.post("/new-expense", async (req, res) => {
//   try {
//     // Lakukan pengecekan apakah data sudah ada sebelumnya
//     const existingExpense = await axios.get(`${axiosURL}/user`, {
//       params: { name: req.body.name }, // Ganti 'name' dengan properti yang sesuai
//     });

//     if (existingExpense.data.length > 0) {
//       // Jika data sudah ada, kirimkan respon bahwa user sudah ada
//       return res.status(409).json({ message: "User already exists" });
//     }

//     // Jika data belum ada, lanjutkan dengan membuat data baru
//     const response = await axios.post(`${axiosURL}/user`, req.body);
//     res.send(response.data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: err });
//   }
// });

router.post("/new-expensee", async (req, res) => {
    try {
        const response = await axios.post(`${axiosURL}/user`, req.body);
    res.send(response.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
})

/////////////// edit
router.patch("/expense/:id", async (req, res) => {
  try {
    const response = await axios.patch(`${axiosURL}/user/${req.params.id}`, req.body);
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

////////////// delete
router.delete("/delete-expense/:id", async (req, res) => {
    try {
        const response = await axios.delete(`${axiosURL}/user/${req.params.id}`);
        res.send(`Delete expense success`);
        console.log("delete expense success");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
 
});


///// Get total expense by date range
router.get("/expense/total-date", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Ambil semua expenses dari server
      const response = await axios.get(`${axiosURL}/user`);
  
      // Filter expenses berdasarkan tanggal
      const filteredExpenses = response.data.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
      });
      console.log(filteredExpenses);
  
      // Hitung total expense
      const totalExpense = filteredExpenses.reduce((total, expense) => total + expense.nominal, 0);
  console.log(totalExpense);
      res.json({ totalExpense });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  });


  
///// Get total expense by date range






///////// Get total expense by category
router.get("/expense/:category", async (req, res) => {
    try {
      const category = req.params.category;
  
      // Ambil semua expenses dari server
      const response = await axios.get(`${axiosURL}/user`);
  
      // Filter expenses berdasarkan kategori
      const filteredExpenses = response.data.filter((expense) => expense.category === category);
  
      // Hitung total expense
      const totalExpense = filteredExpenses.reduce((total, expense) => total + expense.nominal, 0);
  
      res.json(`Total expense ${category} = $${ totalExpense }`);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  });
  

module.exports = router;
