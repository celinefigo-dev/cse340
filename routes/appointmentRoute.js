const express = require("express")
const router = new express.Router()
const appointmentController = require("../controllers/appointmentController")
const utilities = require("../utilities")

router.get(
  "/",
  utilities.handleErrors(appointmentController.buildAppointment)
)

module.exports = router