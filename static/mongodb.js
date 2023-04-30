const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(express.static('static'));
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect('mongodb+srv://programmingpf:Ijx3AaUwobwc0qEH@clustergl.yumc33w.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  username: String
});

const User = mongoose.model('User', userSchema);

app.post('/sign_up', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const pass = req.body.password;
  const username = req.body.username;

  const user = new User({
    name: name,
    email: email,
    password: pass,
    username: username
  });

  user.save(function(err) {
    if (err) {
      throw err;
    }
    console.log('User created successfully!');
    return res.redirect('signup_success.html');
  });
});




app.get("/", (_req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*', // Required for CORS support to work
    })
    return res.redirect('register.html');
}).listen(3000);

console.log("Server is running on port 3000")



