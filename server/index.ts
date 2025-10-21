import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import db from './database';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// API Routes

// Get all users
app.get('/api/users', (_req, res) => {
  const users = db.prepare('SELECT id, username, display_name, created_at FROM users').all();
  res.json(users);
});

// Get all news posts with user info
app.get('/api/news', (_req, res) => {
  const posts = db.prepare(`
    SELECT
      news_posts.id,
      news_posts.title,
      news_posts.content,
      news_posts.created_at,
      users.username,
      users.display_name
    FROM news_posts
    JOIN users ON news_posts.user_id = users.id
    ORDER BY news_posts.created_at DESC
  `).all();
  res.json(posts);
});

// Create new news post
app.post('/api/news', (req, res) => {
  const { user_id, title, content } = req.body;
  const result = db.prepare('INSERT INTO news_posts (user_id, title, content) VALUES (?, ?, ?)').run(user_id, title, content);

  const newPost = db.prepare(`
    SELECT
      news_posts.id,
      news_posts.title,
      news_posts.content,
      news_posts.created_at,
      users.username,
      users.display_name
    FROM news_posts
    JOIN users ON news_posts.user_id = users.id
    WHERE news_posts.id = ?
  `).get(result.lastInsertRowid);

  res.json(newPost);
});

// Get comments for a post
app.get('/api/news/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const comments = db.prepare(`
    SELECT
      comments.id,
      comments.content,
      comments.created_at,
      users.username,
      users.display_name
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `).all(postId);
  res.json(comments);
});

// Add comment to a post
app.post('/api/news/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { user_id, content } = req.body;
  const result = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)').run(postId, user_id, content);

  const newComment = db.prepare(`
    SELECT
      comments.id,
      comments.content,
      comments.created_at,
      users.username,
      users.display_name
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.id = ?
  `).get(result.lastInsertRowid);

  res.json(newComment);
});

// Get recent chat messages
app.get('/api/chat/messages', (_req, res) => {
  const messages = db.prepare(`
    SELECT
      chat_messages.id,
      chat_messages.message,
      chat_messages.created_at,
      users.username,
      users.display_name
    FROM chat_messages
    JOIN users ON chat_messages.user_id = users.id
    ORDER BY chat_messages.created_at DESC
    LIMIT 100
  `).all();
  res.json(messages.reverse());
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('chat_message', (data: { user_id: number; message: string; username: string; display_name: string }) => {
    // Save to database
    const result = db.prepare('INSERT INTO chat_messages (user_id, message) VALUES (?, ?)').run(data.user_id, data.message);

    const newMessage = {
      id: result.lastInsertRowid,
      message: data.message,
      username: data.username,
      display_name: data.display_name,
      created_at: new Date().toISOString()
    };

    // Broadcast to all connected clients
    io.emit('chat_message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
