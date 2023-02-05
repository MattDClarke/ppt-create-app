const mongoose = require('mongoose');

// Make sure we are running node 14.17+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 14 || (major === 14 && minor <= 1)) {
  console.log(
    "🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou're on an older version of node that doesn't support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 14.17 or greater. 👌\n "
  );
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// getClient used order to use existing connection (for connect-mongo session store)
const clientP = mongoose
  .connect(process.env.DATABASE)
  // returns the MongoDB driver MongoClient that this connection uses to talk to MongoDB
  .then((m) => m.connection.getClient());

mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

module.exports = clientP;

// import all models
// done once - a singleton (Node). Model understood throughout by Mongo DB, dnt need to import model at the top of each file
// a singleton represents a single instance of an object. Only 1 can be created.
require('./models/User');
require('./models/WordList');
require('./models/Book');
require('./models/List');

// Start app
const app = require('./app');

app.set(
  'port',
  process.env.NODE_ENV === 'production' ? process.env.PORT : 7777
);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
