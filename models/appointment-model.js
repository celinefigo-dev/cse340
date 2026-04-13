const pool = require("../database/"); 

async function bookAppointment(account_id, date, time, purpose) {
  const sql = `INSERT INTO appointments (account_id, date, time, purpose)
               VALUES ($1, $2, $3, $4) RETURNING *`;
  return pool.query(sql, [account_id, date, time, purpose]);
}

async function getAppointmentsByUser(account_id) {
  const sql = `SELECT * FROM appointments WHERE account_id = $1 ORDER BY date, time`;
  return pool.query(sql, [account_id]);
}

module.exports = { bookAppointment, getAppointmentsByUser };