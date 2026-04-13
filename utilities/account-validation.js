const utilities = require('.')
const accountModel = require('../models/account-models')
const { body, validationResult } = require('express-validator')

const validate = {}

/* **********************************
 * Middleware to check if user is logged in
 * **********************************/
validate.checkLogin = (req, res, next) => {
  // res.locals.accountData should be set when user is authenticated (e.g., via JWT or session)
  if (res.locals.accountData) {
    return next()
  }
  req.flash("error", "You must be logged in to view this page.")
  return res.redirect("/account/login")
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExist = await accountModel.checkEmailExist(account_email)
        if (emailExist) {
          throw new Error("Email already exist! Please log in or register with a new email.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* **********************************
 * Check login data and return errors
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
  }

  next()
}

// Update Account Rules
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().isLength({ min: 1 }).withMessage("First name required."),
    body("account_lastname").trim().isLength({ min: 1 }).withMessage("Last name required."),
    body("account_email").trim().isEmail().withMessage("A valid email is required.")
  ]
}

// Check Update Data
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/updateAccount", {
      title: "Update Your Account Information",
      nav,
      errors,
      accountData: req.body,
      notice: req.flash("notice")
    })
  }
  next()
}

// Change Password Rules
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ]
}

// Check Password Data
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const accountData = {
    account_id: req.body.account_id,
    account_firstname: req.body.account_firstname || res.locals.accountData.account_firstname,
    account_lastname: req.body.account_lastname || res.locals.accountData.account_lastname,
    account_email: req.body.account_email || res.locals.accountData.account_email
  }

  if (!errors.isEmpty()) {
    return res.render("account/updateAccount", {
      title: "Update Your Account Information",
      nav,
      errors,
      notice: req.flash("notice"),
      accountData
    })
  }
  next()
}

module.exports = validate