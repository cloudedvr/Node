// app.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Logger Middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);

/**
 * Fetch user data from GitHub API
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} - Promise resolving to user data
 */
const fetchUser = async (username) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error);
    throw error;
  }
};

/**
 * Fetch multiple users data concurrently
 * @returns {Promise<Array<Object>>} - Promise resolving to an array of user data
 */
const getUsers = async () => {
  try {
    const users = await Promise.all([
      fetchUser('elie'),
      fetchUser('joelburton'),
      fetchUser('mmmaaatttttt')
    ]);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
