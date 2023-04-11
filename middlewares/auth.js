const express = require('express');
require('dotenv').config();
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getPopularGames } = require('./rawg');
const db = require('./db');

const secretKey = process.env.JWT_SECRET;

// Middleware function to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).send('Not authenticated');
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.userId = decoded.id;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send('Invalid token');
    }
};

// Middleware function to check if user is authorized
const isAuthorized = (req, res, next) => {
    const userId = req.userId;
  
    // Check if user is an admin
    if (userId !== 'admin') {
      return res.status(403).send('Not authorized');
    }
  
    next();
};

// RAWG.io API endpoint to retrieve popular games
app.get('/games/popular', isAuthenticated, async (req, res) => {
    try {
      const games = await getPopularGames();
      res.send(games);
    } catch (error) {
      console.log(`Error retrieving popular games from RAWG.io: ${error}`);
      res.status(500).send('Internal Server Error');
    }
});

// USER REGISTRATION ENDPOINT
router.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const collection = db.get().collection('users');
    
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
      password
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

        const collection = db.get().collection('users');

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
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.send({ token });
        } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// USER LOGOUT ENDPOINT
router.post('/api/logout', (req, res) => {
    // clear the JWT cookie
});

module.exports = router;

router.post('/api/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).send('User logged out successfully');
});

