const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ***************************
 * View routes
 * ************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.handleErrors(accountController.buildManagement))
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateView)
)
router.get("/logout", utilities.handleErrors(accountController.logout))

/* ***************************
 * Process routes
 * ************************** */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router