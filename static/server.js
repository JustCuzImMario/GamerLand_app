import express from 'express';
import { connect } from 'mongoose';
import Game from '../static/game.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URL;
const apiKey = process.env.RAWG_API_KEY;



// Enable CORS
app.use(cors());

// MongoDB connection
connect(url , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err.message));


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
console.log(`Server started successfully.`);

app.get('/games/:id', async (req, res) => {
    console.log('Reached app.get route');
    const gameId = req.params.id;
    
    try {
      // Check if game exists in MongoDB
      const game = await Game.findOne({ _id: gameId });
      
      if (game) {
        // If game exists in MongoDB, send it as response
        console.log(game);
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


console.log('Server is running')


// User Schema
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
const User = mongoose.model('User', userSchema);


// Register route
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = new User({ username, password });
      await user.save();
      res.status(201).send('User created');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
    }
  });


// Login route
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send('Username or password is incorrect');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send('Username or password is incorrect');
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.send('Logged in');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in user');
    }
  });
  
  