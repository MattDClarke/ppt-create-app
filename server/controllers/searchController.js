const { createApi } = require('unsplash-js');

exports.imageSearch = async (req, res) => {
  const perPage = 10;
  const { query, page } = req.query;
  const UnsplashServerApi = createApi({
    accessKey: process.env.UNSPLASH_API_KEY,
  });
  UnsplashServerApi.search
    .getPhotos({
      query,
      page,
      perPage,
    })
    .then((result) => {
      if (result.errors) {
        // normally only 1 error - according to Unsplash docs. Array of strings
        res.status(400).json(result.errors[0]);
      } else {
        const feed = result.response;
        // extract total and results array from response
        const { total, results } = feed;
        // filter feed - dnt need all the info.
        const filteredResults = results.map((pic) => ({
          id: pic.id,
          width: pic.width,
          height: pic.height,
          url_thumb: pic.urls.thumb,
          url_regular: pic.urls.regular,
          alt_description: pic.alt_description,
          username: pic.user.name,
          profile: pic.links.html,
          trigger_download_API: pic.links.download_location,
        }));
        res.json({ total, filteredResults });
      }
    })
    // if internet connection issue
    .catch(() => {
      res.status(500).json('Internet connection error');
    });
};

exports.trackDownload = async (req, res) => {
  const { downloadLocations } = req.query;
  const downloadLocationsArr = downloadLocations.split(',');
  const UnsplashServerApi = createApi({
    accessKey: process.env.UNSPLASH_API_KEY,
  });
  // multiple API calls
  downloadLocationsArr.forEach((url) =>
    UnsplashServerApi.photos
      .trackDownload({
        downloadLocation: url,
      })
      .catch(() => {
        res.status(200).json('Error');
      })
  );
  res.json('success');
};
