const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7700;

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Binary Bua server is running");
});

app.listen(port, () => {
    console.log(`Binary bua server is running on port: ${port}`);
});
