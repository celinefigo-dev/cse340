const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const utilities = require("../utilities")
const accountModel = require("../models/account-model")

const accountController = {}

accountController.buildLogin = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: "",
      notice: req.flash("notice"),
    })
  } catch (error) {
    next(error)
  }
}

accountController.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

accountController.buildUpdateView = async function (req, res, next) {
  try {
    const account_id = req.params.account_id
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      notice: req.flash("notice"),
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
  } catch (error) {
    next(error)
  }
}

accountController.accountLogin = async function (req, res, next) {
  try {
    const { account_email, account_password } = req.body
    const nav = await utilities.getNav()
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)

    if (!passwordMatch) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    })

    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      })
    }

    return res.redirect("/account/")
  } catch (error) {
    next(error)
  }
}

accountController.updateAccount = async function (req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body

    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult) {
      const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      })

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1000,
        })
      }

      req.flash("notice", "Your account information was updated successfully.")
      return res.redirect("/account/")
    }

    req.flash("notice", "Sorry, the update failed.")
    return res.redirect(`/account/update/${account_id}`)
  } catch (error) {
    next(error)
  }
}

accountController.updatePassword = async function (req, res, next) {
  try {
    const { account_id, account_password } = req.body
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
      req.flash("notice", "Your password was updated successfully.")
      return res.redirect("/account/")
    }

    req.flash("notice", "Sorry, the password update failed.")
    return res.redirect(`/account/update/${account_id}`)
  } catch (error) {
    next(error)
  }
}

accountController.logout = async function (req, res, next) {
  try {
    res.clearCookie("jwt")
    return res.redirect("/")
  } catch (error) {
    next(error)
  }
}

module.exports = accountController