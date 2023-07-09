const axios = require("axios");
const url = process.env.JSON_SERVER_URL;

const getExpense = async (req, res) => {
    try {
        const { category, subcategory, startDate, endDate } = req.query;
        const paramCategory = category ? "category=" + category : "";
        const paramSubcategory = subcategory ? "subcategory=" + subcategory : "";
        let paramDate = "";

        if (startDate && endDate) {
            const dateFrom = new Date(startDate).getTime();
            const dateTo = new Date(endDate).getTime();
            paramDate = `date_gte=${dateFrom}&date_lte=${dateTo}`;
        }
        const { data } = await axios.get(`${url}/expense?${paramCategory}&${paramSubcategory}&${paramDate}`);
        
        if (data.length > 0) {
            res.status(200).json({
                message: "Get Expense Successfull",
                data
            })
        } else {
            res.status(404).send("Expense tidak ditemukan")
        }
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }
}

const getExpenseById = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { data } = await axios.get(`${url}/expense/${expenseId}`);
        res.status(200).json({
            message: "Get Expense Successfull",
            data
        })
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }
}

const createExpense = async (req, res) => {
    try {
        const { category, subcategory, amount, note } = req.body;
        const { data } = await axios.post(`${url}/expense`, {
            category,
            subcategory,
            amount,
            note,
            date: Date.now()
        });

        res.status(200).json({
            message: "Expense Successfully Added",
            data
        })
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }
}

const editExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { category, subcategory, amount, note } = req.body;
        const { data } = await axios.patch(`${url}/expense/${expenseId}`, {
            category,
            subcategory,
            amount,
            note
        });

        res.status(200).json({
            message: "Expense Successfully Updated",
            data: data
        })
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        await axios.delete(`${url}/expense/${expenseId}`);

        res.status(200).json({
            message: "Expense Successfully Deleted",
        })
    } catch (err) {
        console.log(err);
        res.send(err.message)
    }
}

const totalExpense = async (req, res) => {
    try {
        const { startDate, endDate, category, subcategory } = req.query;
        const paramCategory = category ? "category=" + category : "";
        const paramSubcategory = subcategory ? "subcategory=" + subcategory : "";
        let paramDate = "";

        if (startDate && endDate) {
            const dateFrom = new Date(startDate).getTime();
            const dateTo = new Date(endDate).getTime();
            paramDate = `date_gte=${dateFrom}&date_lte=${dateTo}`;
        }

        const { data } = await axios.get(`${url}/expense?${paramCategory}&${paramSubcategory}&${paramDate}`);
        if (data.length > 0) {
            let totalAmount = 0;
            data.forEach((item) => 
                totalAmount += item.amount
            )
            res.status(200).json({
                message: `Get Total Expense Successfull`,
                data: totalAmount
            })
        } else {
            res.status(404).send("Expense tidak ditemukan")
        }
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
}

module.exports = {
    getExpense,
    getExpenseById,
    createExpense,
    editExpense,
    deleteExpense,
    totalExpense
}