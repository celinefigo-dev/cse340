const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invControllers")
const utilities = require("../utilities")
const errorTestController = require("../controllers/errorTestController")
const {
  classificationRules,
  checkClassificationData,
} = require("../utilities/classificationValidation")
const {
  inventoryRules,
  checkInventoryData,
  checkUpdateData,
} = require("../utilities/inventoryValidation")

router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildInvManagement)
)

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
)

router.get(
  "/addClassification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/addClassification",
  utilities.checkEmployeeOrAdmin,
  classificationRules(),
  checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/getInventory/:classification_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventory)
)

router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteView)
)

router.get(
  "/addInventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/addInventory",
  utilities.checkEmployeeOrAdmin,
  inventoryRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/add-review",
  utilities.handleErrors(invController.addReview)
)

router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  inventoryRules(),
  checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)

router.get(
  "/trigger-error",
  utilities.handleErrors(errorTestController.triggerError)
)

module.exports = router