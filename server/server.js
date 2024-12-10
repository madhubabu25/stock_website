const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "madhu@#4830",
    database: "user_auth",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL.");
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' data:;");
  next();
});


// Register route
app.post("/login", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Check if user exists
        const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).json({ error: "Email already registered." });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

// Route to login
// Route to login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
  
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) throw err;
  
            if (results.length === 0) {
                return res.status(404).json({ error: "User not found." });
            }
  
            const user = results[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  
            if (!isPasswordMatch) {
                return res.status(401).json({ error: "Incorrect password." });
            }
  
            // Successful login
            return res.status(200).json({ message: "Login successful!" });
        }
    );
  });
  


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
