const bcrypt = require('bcrypt');

const users = [];
const posts = [
  { id: 1, title: 'First Post', content: 'Hello World' },
  { id: 2, title: 'Second Post', content: 'Security Matters' }
];

async function initDB() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  users.push({
    id: 1,
    username: 'testuser',
    password: hashedPassword,
    email: 'test@example.com'
  });
}

initDB();

module.exports = {
  users,
  posts
};