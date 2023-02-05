const mongoose = require('mongoose');

const WordList = mongoose.model('WordList');

exports.getWordLists = async (req, res) => {
  const lists = await WordList.find({ user: req.user.id });
  res.json({
    lists,
  });
};

exports.wordListAddorEdit = async (req, res) => {
  await WordList.updateOne(
    {
      user: req.user.id,
      title: req.body.title,
    },
    {
      $set: { words: req.body.words },
      // only added on upsert
      $setOnInsert: { order: req.body.order },
    },
    {
      upsert: true,
      runValidators: true,
    }
  );
  res.json('success');
};

exports.wordListDelete = async (req, res) => {
  const { title, order, numberOfWordLists } = req.body;
  const userId = req.user.id;
  const wordListsTitlesOperations = [];
  const wordListDeleteOperation = {
    deleteOne: {
      filter: {
        user: userId,
        title,
      },
    },
  };

  wordListsTitlesOperations.push(wordListDeleteOperation);
  for (let i = order + 1; i <= numberOfWordLists; i += 1) {
    wordListsTitlesOperations.push({
      updateOne: {
        filter: {
          user: userId,
          order: i,
        },
        update: {
          $set: { order: i - 1 },
        },
      },
    });
  }
  await WordList.bulkWrite(wordListsTitlesOperations);
  res.json('success');
};

exports.wordListsDeleteAll = async (req, res) => {
  await WordList.deleteMany({ user: req.user.id });
  res.json('success');
};

exports.wordListsReorder = async (req, res) => {
  const { wordListsTitles } = req.body;
  const userId = req.user.id;

  const wordListsTitlesOperations = wordListsTitles.map((obj) => ({
    updateOne: {
      filter: {
        user: userId,
        title: obj.title,
      },
      update: {
        $set: { order: obj.order },
      },
    },
  }));

  await WordList.bulkWrite(wordListsTitlesOperations);
  res.json('success');
};
