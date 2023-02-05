const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const wordListSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a user',
  },
  title: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
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

wordListSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('WordList', wordListSchema);
