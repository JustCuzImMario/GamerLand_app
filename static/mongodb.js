const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URL
const dbName = 'gamerland_db';

let client;

async function connect() {
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log('Connected successfully to MongoDB');
    return client.db(dbName);
  } catch (err) {
    console.log('Failed to connect to MongoDB:', err);
    throw err;
  }
}

function getClient() {
  return client;
}

async function insertUser(user) {
  const db = client.db(dbName);
  const collection = db.collection('users');
  const result = await collection.insertOne(user);
  return result;
}



module.exports = { connect, getClient, insertUser };
