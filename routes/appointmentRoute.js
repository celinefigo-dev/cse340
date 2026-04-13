const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const utilities = require("../utilities/");
const { checkLogin } = require("../utilities/account-validation");

// TEST: Log the imported appointmentController object to verify the functions are present
console.log("appointmentController:", appointmentController);

router.get("/book", checkLogin, appointmentController.showBookingForm);
router.post("/book", checkLogin, appointmentController.handleBooking);
router.get("/", checkLogin, appointmentController.showAppointments);

module.exports = router;