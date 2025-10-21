import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../data/app.db'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES news_posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Insert demo users if table is empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (username, display_name) VALUES (?, ?)');
  insertUser.run('max.mueller', 'Max Müller');
  insertUser.run('anna.schmidt', 'Anna Schmidt');
  insertUser.run('tom.weber', 'Tom Weber');

  // Insert demo news post
  const insertPost = db.prepare('INSERT INTO news_posts (user_id, title, content) VALUES (?, ?, ?)');
  insertPost.run(1, 'Willkommen in der Unternehmens-App!', 'Hier können Sie sich über Neuigkeiten informieren und mit Kollegen chatten.');
}

export default db;
