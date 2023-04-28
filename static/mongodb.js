const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://programmingpf:Ijx3AaUwobwc0qEH@clustergl.mongodb.net/gamerland_db?retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

module.exports = {
  connectToServer: function(callback) {
    client.connect(function(err, client) {
      db = client.db('gamerland_db');
      return callback(err);
    });
  },

  getDb: function() {
    return db;
  }
};
