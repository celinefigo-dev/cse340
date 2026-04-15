const pool = require("../database")

async function getAccountByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM public.account WHERE account_email = $1",
    [email]
  )
  return result.rows[0]
}

module.exports = {
  getAccountByEmail,
}