const pool = require("../database")

async function createAppointment(name, date) {
  const result = await pool.query(
    "INSERT INTO public.appointment (name, date) VALUES ($1, $2) RETURNING *",
    [name, date]
  )
  return result.rows[0]
}

module.exports = {
  createAppointment,
}