const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require('path');
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
const PORT = 3000;

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "madhu@#4830",
  database: "market_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// Middleware
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../public')));


// Route - Fetch stock data from database
app.get("/stocks", (req, res) => {
  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route - Fetch news from database
app.get("/news", (req, res) => {
  db.query("SELECT * FROM news", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route - Fetch market history from database
app.get("/history", (req, res) => {
  db.query("SELECT * FROM history ORDER BY date DESC LIMIT 7", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route - Fetch market highlights from database
app.get("/highlights", (req, res) => {
  db.query("SELECT * FROM highlights ORDER BY date DESC LIMIT 5", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// POST Route - Submit a comment to database
app.post('/submit-comment', (req, res) => {
  const { name, comment } = req.body;

  const sql = 'INSERT INTO comments (username, comment) VALUES (?, ?)';
  db.query(sql, [name, comment], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving the comment');
    }
    res.status(200).send('Comment saved');
  });
});

// GET Route - Fetch recent comments from database
app.get('/get-comments', (req, res) => {
  const sql = 'SELECT * FROM comments ORDER BY created_at DESC LIMIT 10';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching comments: ', err);
      return res.status(500).send('Error fetching comments');
    }

    console.log("Fetched comments from database: ", results);
    res.json(results);
  });
});

// Route - Handle User Signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO users_l (username, email, password) VALUES (?, ?, ?)";
  
      db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Signup failed. Username or email might already exist." });
        }
        res.status(200).json({ message: "User signed up successfully" });
      });
    } catch (error) {
      console.error("Error while hashing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

// Route - Handle User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }
  
    const sql = "SELECT * FROM users_l WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error processing login" });
        }
  
        if (isMatch) {
          return res.status(200).json({ message: "Login successful" });
        } else {
          return res.status(401).json({ error: "Invalid email or password" });
        }
      });
    });
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
