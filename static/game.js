import { Schema, model } from 'mongoose';

const gameSchema = new Schema({
  name: String,
  coverImage: String,
  description: String,
  releaseDate: Date,
  platforms: [String],
  genres: [String],
  developers: [String],
});

const Game = model('Game', gameSchema);

export default Game;
