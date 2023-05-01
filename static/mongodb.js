// Run: node static/mongodb.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create express app
const app = express();

// Use body-parser middleware
app.use(bodyParser.json());
app.use(express.static('static'));
app.use(bodyParser.urlencoded({
    extended: true
  }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://programmingpf:Ijx3AaUwobwc0qEH@clustergl.yumc33w.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create MongoDB connection object
const db = mongoose.connection;

// Set up event listener that will fire once the connection opens for the database
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Create mongoose schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  username: String
});

// Create mongoose model
const User = mongoose.model('User', userSchema);

// Create a POST route for /sign_up
app.post('/sign_up', async function (req, res) {
  console.log('Request received for /sign_up');
  const name = req.body.name;
  const email = req.body.email;
  const pass = req.body.password;
  const username = req.body.username;

  // Create new user using the User model
  const user = new User({
    name: name,
    email: email,
    password: pass,
    username: username
  });

  // Save user to database
  try {
    await user.save();
    // Send success message back to client
    console.log('User created successfully!');
    return res.redirect('signup_success.html');
  } catch (err) {
    console.log('Error in saving user to database');
    throw err;
  }
});

// Create a GET route for /
app.get("/", (_req, res) => {
  console.log('Request received for /');
  res.set({
    "Allow-access-Allow-Origin": '*', // Required for CORS support to work
  });
  return res.redirect('register.html');
}).listen(3000);

// Log to console to let us know it's working
console.log("Server is running on port 3000");

