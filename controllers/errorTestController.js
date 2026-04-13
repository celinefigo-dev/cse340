const errorTestController = {};

errorTestController.triggerError = (req, res, next) => {
  // Intentionally trigger an error
  const err = new Error("This is an international 500 server error!");
  err.status = 500;
  next(err);
};

module.exports = errorTestController;