/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) =>
  function (req, res, next) {
    return fn(req, res, next).catch(next);
  };

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler and Redis connection error

  Detect if there are mongodb validation errors that we can nicely show
*/

exports.showValidationErrors = (err, req, res, next) => {
  if (!err.errors) {
    // if there are no errors to show for MongoDB or Redis then skip it -> go to dev / production error middleware
    return next(err);
  }

  // Node Redis returns a NR_CLOSED error code if the clients connection dropped
  if (err.code === 'NR_CLOSED' || err.code === 'ECONNRESET') {
    res.status(500).json('There was a connection error');
  } else {
    res.status(422).json('There was an error');
  }
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json('Image file size max = 5mb');
  }
  console.log('dev error -->', err);
  res.status(err.status || 500);
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
    code: err.code,
  };
  console.log('err details', errorDetails);
  res.json('There was an Error');
};

/*
  Production Error Handler
*/
exports.productionErrors = (err, req, res, next) => {
  console.log('production error');
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json('Image file size max = 5mb');
  }
  res.status(err.status || 500);
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack,
  };
  // may be good for me to check server logs - what errors occur in production
  console.log(errorDetails);
  res.json('There was an Error');
};
