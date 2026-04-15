const utilities = require("../utilities")

const appointmentController = {}

appointmentController.buildAppointment = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("appointments/index", {
      title: "Book Appointment",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = appointmentController