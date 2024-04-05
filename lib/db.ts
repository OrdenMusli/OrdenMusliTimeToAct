const { Database } = require("sqlite3");

const dbPath = "C:/Users/admin/Desktop/database/database.db";
const db = new Database(dbPath);

db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    completed INTEGER
)`);
ALTER TABLE todos
ADD COLUMN completed BOOLEAN DEFAULT FALSE;
