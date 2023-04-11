const express = require('express');
const router = express.Router();
const { getPopularGames } = require('../rawg');

// RAWG.io API endpoint to retrieve popular games
router.get('/popular', isAuthenticated, async (req, res) => {
    try {
      const games = await getPopularGames();
      res.send(games);
    } catch (error) {
      console.log(`Error retrieving popular games from RAWG.io: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  });

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
  
module.exports = router;
