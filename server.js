const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch'); // Import node-fetch package

const app = express();
const db = new sqlite3.Database('messages.db'); // Use a file-based database

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create the messages table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT
    )
  `);
});

// Route to handle contact form submissions
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  const stmt = db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
  stmt.run(name, email, message, (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error saving message");
    }
    res.status(200).send("Message saved successfully");
  });
  stmt.finalize();
});

// Route to retrieve messages
app.get('/messages', (req, res) => {
  db.all("SELECT * FROM messages", (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error retrieving messages");
    }
    res.json(rows);
  });
});

// Route to fetch recent repositories from GitHub API
app.get('/repositories', async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/users/NganduChoolwe/repos?sort=updated');
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    const repositories = await response.json();
    res.json(repositories);
  } catch (error) {
    console.error('GitHub API error:', error.message);
    res.status(500).send('Error fetching repositories');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});