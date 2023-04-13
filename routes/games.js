const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getPopularGames, getGameDetails } = require('../rawg');
const Game = require('../models/game');
const { secretKey } = require('../config');

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

router.post('/', async (req, res) => {
  const { gameId, title, description, genres, platforms, releaseDate, publisher, developer, rating, imageUrl } = req.body;

  try {
    const game = new Game({
      gameId,
      title,
      description,
      genres,
      platforms,
      releaseDate,
      publisher,
      developer,
      rating,
      imageUrl,
    });
  
      await game.save();
      res.send('Game added successfully');
    } catch (error) {
      console.error(`Error saving game: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  });

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const { filter } = req.query;

  try {
    const games = await searchGames(query, filter);
    res.json(games);
  } catch (error) {
    console.error(`Error retrieving game details from RAWG.io: ${error}`);
    res.status(500).send('Internal Server Error');
  }
});
  
  

module.exports = router;
