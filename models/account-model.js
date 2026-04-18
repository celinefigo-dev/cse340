const pool = require("../database")


/* *****************************
 * Get account by email
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function accountRegister(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `
      INSERT INTO public.account
      (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function updatePassword(account_password, account_id) {
  try {
    const sql = `
      UPDATE public.account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id
    `
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  accountRegister,
  updateAccount,
  updatePassword,
  checkExistingEmail,
}