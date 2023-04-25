const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URL
const mongoose = require('mongoose');
const Game = require('./models/Game');




// MongoDB connection
mongoose.connect(url , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err.message));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const fetch = require('node-fetch');
const VideoGame = require('./models/VideoGame');

app.get('/games/:id', async (req, res) => {
    const gameId = req.params.id;
    
    try {
      // Check if game exists in MongoDB
      const game = await Game.findOne({ _id: gameId });
      
      if (game) {
        // If game exists in MongoDB, send it as response
        res.json(game);
      } else {
        // If game doesn't exist in MongoDB, fetch it from RAWG.io API
        const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Map RAWG.io game data to match MongoDB schema
        const newGame = {
          _id: data.id.toString(),
          name: data.name,
          coverImage: data.background_image,
          description: data.description_raw,
          releaseDate: data.released,
          platforms: data.platforms.map((platform) => platform.platform.name),
          genres: data.genres.map((genre) => genre.name),
          developers: data.developers.map((developer) => developer.name),
        };
        
        // Save new game to MongoDB
        const savedGame = await Game.create(newGame);
        
        // Send new game as response
        res.json(savedGame);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching video game' });
    }
  });
  
