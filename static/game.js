const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,
  coverImage: String,
  description: String,
  releaseDate: Date,
  platforms: [String],
  genres: [String],
  developers: [String],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
