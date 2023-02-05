const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const bookSchema = new Schema({
  // to get books for a particular level and grade
  levelAndGrade: {
    type: String,
    trim: true,
  },
  // to check if book exists
  // levelAndGrade + year + publisher + author
  // also used to get image from backend - image name = bookKey
  bookKey: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  publisher: {
    type: String,
    trim: true,
  },
  authorSurname: {
    type: String,
    trim: true,
  },
});

bookSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Book', bookSchema);
