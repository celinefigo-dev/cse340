const utilities = require("../utilities")

const baseController = {}

baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("index", {
      title: "Home | CSE Motors",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = baseController