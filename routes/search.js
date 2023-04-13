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

router.get('/', async (req, res) => {
    try {
      const { query } = req.query;
      const response = await axios.get('https://api.rawg.io/api/games', {
        params: {
          search: query,
          key: process.env.RAWG_API_KEY
        }
      });
      const { results } = response.data;
      res.render('search', { results });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;



