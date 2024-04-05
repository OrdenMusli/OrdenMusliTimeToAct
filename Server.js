const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
const port = process.env.PORT || 3001;

const dbPath = "C:/Users/admin/Desktop/database/database.db";
const db = new sqlite3.Database(dbPath);

app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
