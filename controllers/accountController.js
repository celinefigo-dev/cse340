const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Build account management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    loggedin: res.locals.loggedin,
    errors: null
  })
}

/* ****************************************
 *  Logout view
 * ************************************ */
async function buildLogoutSession(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  res.redirect("/")
}


/* ****************************************
 *  Update account view and process
 * ************************************ */
async function buildUpdateAccount(req, res) {
  const accountId = req.params.accountId 
  const accountData = await accountModel.getAccountById(accountId)
  let nav = await utilities.getNav()
  res.render(`account/update`, {
    title: "Update Account Information",
    nav,
    accountData,
    errors: null,
    flash: req.flash("notice")
  })
}

async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (result) {
    //  Actualizar el JWT con los nuevos datos
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed. Please try again.")
    res.redirect(`/account/update/${account_id}`)
  }
}

async function updatePassword(req, res) {
  const { account_id, new_password } = req.body
 // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(new_password, 10)
  } catch (error) {
    req.flash("notice", 'There was an error processing the password update.')
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      accountData,
      errors: null,
    })
    return
  }

  const result = await accountModel.updatePassword(account_id, hashedPassword)
  let nav = await utilities.getNav()
  if (result) {

 const accountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "Password updated successfully.")
    res.render("account/management", {
      title: "Account Management",
      nav,
      accountData,
      errors: null,
    })
  } else {
    const accountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "Update failed. Please try again.")
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      accountData,
      errors: null,
    })
  }


}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildLogoutSession, buildUpdateAccount, updateAccount, updatePassword }