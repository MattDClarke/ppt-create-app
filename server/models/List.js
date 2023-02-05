const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const listSchema = new Schema({
  // same as bookKey in Book model (for school book lists)
  // also use for other lists (verbs, animals, ...)
  pageKey: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  words: [
    {
      id: {
        type: String,
      },
      // automatically created for objects - not needed
      _id: false,
      word: {
        type: String,
        trim: true,
      },
    },
  ],
});

listSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('List', listSchema);
