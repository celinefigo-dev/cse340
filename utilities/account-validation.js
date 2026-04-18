const { body, validationResult } = require("express-validator")
const utilities = require(".")
const accountModel = require("../models/account-model")

const validate = {}

/* ************************
 * Registration validation rules
 * ************************ */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("A first name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("A last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email.")
        }
      }),

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

/* ************************
 * Check registration data
 * ************************ */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.status(400).render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      notice: null,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* ************************
 * Login validation rules
 * ************************ */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ************************
 * Check login data
 * ************************ */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      notice: null,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* ************************
 * Update account rules
 * ************************ */
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
      .normalizeEmail()
      .withMessage("Please provide a valid email address."),
  ]
}

/* ************************
 * Check update account data
 * ************************ */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
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
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Email exists. Please use a different email." }],
      notice: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

/* ************************
 * Password validation rules
 * ************************ */
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

/* ************************
 * Check password update data
 * ************************ */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_id } = req.body
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
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