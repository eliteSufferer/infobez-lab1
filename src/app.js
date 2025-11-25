const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users, posts } = require('./db');
const { authenticateToken, SECRET_KEY } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/data', authenticateToken, (req, res) => {
  try {
    const sanitizedPosts = posts.map(post => ({
      id: post.id,
      title: escapeHtml(post.title),
      content: escapeHtml(post.content)
    }));

    res.json({
      message: 'Data retrieved successfully',
      user: req.user.username,
      data: sanitizedPosts
    });
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/posts', authenticateToken, (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const newPost = {
      id: posts.length + 1,
      title: escapeHtml(title),
      content: escapeHtml(content),
      author: req.user.username
    };

    posts.push(newPost);

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Secure REST API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});