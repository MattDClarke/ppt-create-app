const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

// Creates a client
const translate = new Translate({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  projectId: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS).project_id,
});

exports.googleTranslate = async (req, res) => {
  const { query, target } = req.query;

  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(query, target);
  translations = Array.isArray(translations) ? translations : [translations];
  res.json(translations);
};
