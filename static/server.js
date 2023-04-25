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

app.get('/games', async (req, res) => {
  const gameName = req.query.name;
  const apiUrl = `https://api.rawg.io/api/games?search=${gameName}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const games = data.results.map((game) => {
      return {
        _id: game.id.toString(), // add _id field and convert to string
        name: game.name,
        coverImage: game.background_image, // change background_image to coverImage
        description: game.description_raw, // change description_raw to description
        releaseDate: game.released, // add releaseDate field
        platforms: game.platforms.map((platform) => platform.platform.name), // add platforms field
        genres: game.genres.map((genre) => genre.name), // add genres field
        developers: game.developers.map((developer) => developer.name), // add developers field
      };
    });

    await VideoGame.insertMany(games);

    res.json({ message: 'Video games added successfully' }); // update success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching video games' }); // update error message
  }
});
