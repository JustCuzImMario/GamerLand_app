const express = require('express');
const { connect, insertUser } = require('./mongodb');
const { port } = require('./config')

const app = express();


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  try {
    const user = req.body;
    console.log('Received user:', user);
    const result = await insertUser(user);
    console.log('Inserted user into database:', result.ops[0]);
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create account' });
  }
});

app.use(express.static('public'));

(async () => {
  try {
    await connect();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.log('Failed to connect to MongoDB:', err);
  }
})();

app.use((req, res) => {
  res.status(404).send('404: Page not found');
});
