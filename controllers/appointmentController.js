const appointmentModel = require("../models/appointment-model");
const utilities = require("../utilities");

async function showBookingForm(req, res) {
  const nav = await utilities.getNav();
  const success = req.query.success === "true";
  res.render("appointments/bookAppointment", {
    title: "Book Appointment",
    accountData: res.locals.accountData,
    nav,
    success,
  });
}

async function handleBooking(req, res) {
  const { date, time, purpose } = req.body;
  const account_id = res.locals.accountData.account_id;
  if (!date || !time || !purpose) {
    req.flash("error", "All fields are required.");
    return res.redirect("/appointments/book");
  }

  try {
    await appointmentModel.bookAppointment(account_id, date, time, purpose);
    req.flash("notice", "Appointment booked successfully!");
    res.redirect("/appointments/book?success=true");
  } catch (error) {
    console.error(error);
    req.flash("error", "There was a problem booking your appointment.");
    res.redirect("/appointments/book");
  }
}

async function showAppointments(req, res) {
  const account_id = res.locals.accountData.account_id;
  const nav = await utilities.getNav();
  const result = await appointmentModel.getAppointmentsByUser(account_id);
  res.render("appointments/viewAppointment", {
    title: "Your Appointments",
    appointments: result.rows,
    accountData: res.locals.accountData,
    nav,
  });
}

module.exports = { showBookingForm, handleBooking, showAppointments };
