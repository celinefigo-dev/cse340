const { body, validationResult } = require("express-validator")
const utilities = require(".")
const accountModel = require("../models/account-model")

const validate = {}

validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please provide a password."),
  ]
}

validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address."),
  ]
}

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least 1 uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least 1 number.")
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      .withMessage("Password must contain at least 1 special character."),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email,
    })
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      notice: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  const emailExists = await accountModel.getAccountByEmail(account_email)
  if (emailExists && Number(emailExists.account_id) !== Number(account_id)) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "That email address already exists. Please use a different email." }],
      notice: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_id } = req.body
  const accountData = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      notice: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  }

  next()
}

module.exports = validate