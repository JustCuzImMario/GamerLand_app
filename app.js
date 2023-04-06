const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uri = 'mongodb+srv://patchflood17:jDKOPluEWmU8CPiw@clustergl.niradnb.mongodb.net/gamerland_db';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const { getPopularGames } = require('./rawg');


require('dotenv').config();
const express = require('express');
const secretKey = process.env.SECRET_KEY;

// RAWG.io API endpoint to retrieve popular games
app.get('/games/popular', isAuthenticated, async (req, res) => {
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
  
  // Middleware function to check if user is authorized
  const isAuthorized = (req, res, next) => {
    const userId = req.userId;
  
    // Check if user is an admin
    if (userId !== 'admin') {
      return res.status(403).send('Not authorized');
    }
  
    next();
  };



// Connect to MongoDB
client.connect(err => {
  if (err) {
    console.log(`Error connecting to MongoDB: ${err}`);
  } else {
    console.log(`Connected to MongoDB`);

    const discussionsCollection = client.db('gamerland_db').collection('discussions');
    const gamerSearchesCollection = client.db('gamerland_db').collection('gamer_searches');
    const gamesCollection = client.db('gamerland_db').collection('games');
    const ratingsCollection = client.db('gamerland_db').collection('ratings');
    const reviewsCollection = client.db('gamerland_db').collection('reviews');
    const usersCollection = client.db('gamerland_db').collection('users');

    // route to retrieve data from the "games" collection
    app.get('/games', (req, res) => {
      gamesCollection.find().toArray((err, games) => {
        if (err) {
          console.log(`Error retrieving data from MongoDB: ${err}`);
          res.status(500).send('Internal Server Error');
        } else {
          res.send(games);
        }
      });
    });
  }
});


// USER REGISTRATION ENDPOINT
router.post('/api/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    await client.connect();
    const db = client.db('gamerland_db');
    const collection = db.collection('users');
    
    // Check if user with the given email already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      firstName,
      lastName,
      email,
      password
    };
    
    // Insert user into database
    await collection.insertOne(newUser);
    
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.use(router);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


// LOGIN ENDPOINT
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        await client.connect();
        const db = client.db('gamerland_db');
        const collection = db.collection('users');

        // Find user with the given email
        const user = await collection.findOne({ email });
        if (!user) {
        return res.status(401).send('Invalid email or password');
        }

        // Check if password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
        return res.status(401).send('Invalid email or password');
        }

        // Generate a JSON Web Token (JWT)
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.send({ token });
        } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
  });

// USER LOGOUT ENDPOINT
router.post('/api/logout', (req, res) => {
    // clear the JWT cookie
    res.clearCookie('jwt');
    res.send('User logged out successfully');
  });
  

// Game search endpoint to retrieve games that match a search query.
// Requires user authentication to access.

app.get('/games/search', isAuthenticated, (req, res) => {
    const { query } = req.query;
    
    gamesCollection.find({ $text: { $search: query } }).toArray((err, games) => {
      if (err) {
        console.log(`Error retrieving data from MongoDB: ${err}`);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(games);
      }
    });
  });

  // Game details endpoint
  app.get('/games/:id', isAuthenticated, (req, res) => {
    const gameId = req.params.id;
  
    gamesCollection.findOne({ _id: ObjectId(gameId) }, (err, game) => {
      if (err) {
        console.log(`Error retrieving data from MongoDB: ${err}`);
        res.status(500).send('Internal Server Error');
      } else if (!game) {
        res.status(404).send('Game not found');
      } else {
        res.send(game);
      }
    });
  });




  
  
