const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
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
const searchGames = async (query, filter) => {
  const apiUrl = `https://api.rawg.io/api/games?search=${query}&search_precise=true&${filter}_ordering=desc`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.results.map((game) => ({
    gameId: game.id,
    title: game.name,
    description: game.description_raw,
    genres: game.genres.map((genre) => genre.name),
    platforms: game.platforms.map((platform) => platform.platform.name),
    releaseDate: game.released,
    publisher: game.publishers.map((publisher) => publisher.name).join(', '),
    developer: game.developers.map((developer) => developer.name).join(', '),
    rating: game.rating,
    imageUrl: game.background_image,
  }));
};

router.get('/', async (req, res) => {
  const { query, filter } = req.query;
  
  try {
    const games = await searchGames(query, filter);
    res.json(games);
  } catch (error) {
    console.error(`Error retrieving game details from RAWG.io: ${error}`);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
