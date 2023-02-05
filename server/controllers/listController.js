const mongoose = require('mongoose');

const Book = mongoose.model('Book');
const List = mongoose.model('List');

// middleware to handle multiparted form data (with img uploads, text, ...) - adds coverImg to memory so that it can be resized
// handles upload request
const multer = require('multer');

const jimp = require('jimp');
const { cloudinary } = require('../lib/cloudinary');

const multerOptions = {
  // reads coverImg into memory
  storage: multer.memoryStorage(),
  limits: { fileSize: 5242880 },
  filefilter(req, res, file, next) {
    // mimeType will tell what kind of coverImg - png, jpg, ... all files have their own mimeType - cant rely on file extension name only
    // serverside file type validation
    const isPhoto = file.mimeType.startsWith('image/');
    if (isPhoto) {
      // first argument is the error, second is allowed filetype (coverImg)
      next(null, true);
    } else {
      return res.status(415).json('Image filetype not allowed.');
    }
  },
};

// can have multiple fields - but here we just want 1
// multerOptions defined above
exports.upload = multer(multerOptions).single('coverImg');

exports.cloudinaryUpload = async (req, res, next) => {
  // see img in memory - buffer
  // get file type from mimetype - dnt rely on extension... user can change it
  const extension = req.file.mimetype.split('/')[1];
  // req.body will be saved to database in next middleware
  const { levelAndGrade, year, publisher, authorSurname } = req.body;
  const bookKey =
    `${levelAndGrade}_${year}_${publisher}_${authorSurname}`.toLowerCase();
  req.body.bookKey = bookKey;
  req.body.coverImg = `${bookKey}.${extension}`;
  // jimp uses promises so you can await the response. Read from memory in this case
  const coverImg = await jimp.read(req.file.buffer);
  coverImg.getBase64(jimp.AUTO, async (err, response) => {
    await cloudinary.uploader.upload(response, {
      folder: 'ppt-create/book-covers',
      public_id: bookKey,
    });
    next();
  });
};

exports.addBook = async (req, res) => {
  await new Book(req.body).save();
  res.json('Success');
};

exports.getBooks = async (req, res) => {
  // dnt send levelAndGrade - not needed on frontend - only needed for this db search
  const { levelAndGrade } = req.params;
  const books = await Book.find(
    { levelAndGrade },
    'bookKey year publisher authorSurname'
  );
  if (!books.length) {
    return res.status(404).json('Page does not exist');
  }

  // get images from Cloudinary
  const { resources } = await cloudinary.search
    .expression(`public_id: ppt-create/book-covers/${levelAndGrade}*`)
    .sort_by('public_id', 'asc')
    .execute();

  const publicIds = resources.map((file) => file.public_id);

  res.json({
    books,
    publicIds,
  });
};

exports.addListKoreaTextBook = async (req, res) => {
  const { levelAndGrade, year, publisher, authorSurname } = req.body;
  const pageKey =
    `${levelAndGrade}_${year}_${publisher}_${authorSurname}`.toLowerCase();
  req.body.pageKey = pageKey;
  await new List(req.body).save();
  res.json('Success');
};

exports.addListOther = async (req, res) => {
  await new List(req.body).save();
  res.json('Success');
};

exports.getLists = async (req, res) => {
  // dnt send levelAndGrade - not needed on fronend - only needed for this db search
  const { pageKey } = req.params;
  const lists = await List.find({ pageKey });
  if (!lists.length) {
    return res.status(404).json('No lists for this page');
  }
  res.json({
    lists,
  });
};
