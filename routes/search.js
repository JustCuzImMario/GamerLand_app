const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const Game = require('../models/game');
const { secretKey } = require('../config');
const rawg = require('../rawg');

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

const express = require('express');
const rawg = require('../rawg');

router.get('/', async (req, res, next) => {
  try {
    const { query } = req.query;

    console.log(`Received search query: ${query}`); // Log the search query to the console

    const games = await rawg.searchGames(query);
    res.json(games);
  } catch (err) {
    next(err);
  }
});

module.exports = router;



