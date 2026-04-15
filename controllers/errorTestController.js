const errorTestController = {}

errorTestController.triggerError = (req, res, next) => {
  const err = new Error("This is a test error.")
  err.status = 500
  next(err)
}

module.exports = errorTestController