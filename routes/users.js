const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { isAuthenticated } = require('./auth');
const { client } = require('./db');

// USER REGISTRATION ENDPOINT
router.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const db = client.db('gamerland_db');
    const collection = db.collection('users');

    // Check if user with the given email already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with this email already exists');
    }

    // Create new user
    const newUser = {
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
    };

    // Insert user into database
    await collection.insertOne(newUser);

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// LOGIN ENDPOINT
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = client.db('gamerland_db');
    const collection = db.collection('users');

    // Find user with the given email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Check if password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// USER LOGOUT ENDPOINT
router.post('/api/logout', (req, res) => {
  // clear the JWT cookie
  res.clearCookie('jwt');
  res.send('User logged out successfully');
});

// Game search endpoint to retrieve games that match a search query.
// Requires user authentication to access.
router.get('/games/search', isAuthenticated, (req, res) => {
  const { query } = req.query;

  const db = client.db('gamerland_db');
  const gamesCollection = db.collection('games');

  gamesCollection.find({ $text: { $search: query } }).toArray((err, games) => {
    if (err) {
      console.log(`Error retrieving data from MongoDB: ${err}`);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(games);
    }
  });
});

// Export the router.
module.exports = router;
