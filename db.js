const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://patchflood17:jDKOPluEWmU8CPiw@clustergl.niradnb.mongodb.net/gamerland_db';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connect = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('gamerland_db');
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
  }
};

module.exports = { connect };
