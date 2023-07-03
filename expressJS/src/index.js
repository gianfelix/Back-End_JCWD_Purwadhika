import express from 'express';

const PORT = 8000;

const app = express();
app.use(express.json());

// Get Method
app.get("/api", (req, res) => {
    res.send("This is express JS API");
});

app.get("/users", (req, res) => {
    res.send("This is users API");
})

// GET id
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    res.send("GET: this is params id");
})

//----------------------------------------//

// Post Method
app.post("/users/:id", (req, res) => {
    console.log(req.params); // jika pakai /users/:id;
    const { nama, umur, domisili } = req.body;
    console.log(nama, umur, domisili);
    res.send("Got a POST request");
})

// Post parameter
app.post("/users-params/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    res.send("POST: this is params");
})

// Post query
app.post("/users-query", (req, res) => {
    const { id, nama } = req.query;
    console.log(id, nama);
    res.send("POST: this is query");
})

app.post("/users-body", (req, res) => {
    const {nama,umur} = req.body;
    console.log(nama, umur);
    res.send("POST: this is body");
})

app.post("/api/auth/login", (req, res) => {
    const { username, email, phone, password } = req.body;
    res.send(`Post Login: username: ${username}, email: ${email}, phone: ${phone}, password: ${password}`);
})

//----------------------------------------//

// Put Method
app.put("/users/", (req, res) => {
    res.send("Got a PUT request");
})

//----------------------------------------//

// Delete Method
app.delete("/users/:id", (req, res) => {
    res.send("Got a DELETE request");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

