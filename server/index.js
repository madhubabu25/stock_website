require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Import routes
const userRoutes = require("./routes/user");
const transactionRoutes = require("./routes/transactions");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
