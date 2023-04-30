const mongoose = require('mongoose');

// Defining Mongoose Schema for Users, Games, and Ratings
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
});

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'games' },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const UserModel = mongoose.model('users', userSchema);
const GameModel = mongoose.model('games', gameSchema);
mongoose.model('ratings', ratingSchema);

module.exports = { UserModel, GameModel };
