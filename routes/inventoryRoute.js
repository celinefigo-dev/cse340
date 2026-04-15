const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invControllers")
const utilities = require("../utilities")

// Inventory management view
router.get("/", utilities.checkEmployeeOrAdmin, invController.buildInvManagement)

// Build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Build inventory detail view
router.get("/detail/:inv_id", invController.buildByInvId)

// Get inventory by classification as JSON
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Add classification view
router.get("/add-classification", utilities.checkEmployeeOrAdmin, invController.buildAddClassification)

// Add classification action
router.post("/add-classification", utilities.checkEmployeeOrAdmin, invController.addClassification)

// Add inventory view
router.get("/add-inventory", utilities.checkEmployeeOrAdmin, invController.buildAddInventory)

// Add inventory action
router.post("/add-inventory", utilities.checkEmployeeOrAdmin, invController.addInventory)

// Edit inventory view
router.get("/edit/:inv_id", utilities.checkEmployeeOrAdmin, invController.editInventory)

// Update inventory action
router.post("/update/", utilities.checkEmployeeOrAdmin, invController.updateInventory)

// Delete inventory view
router.get("/delete/:inv_id", utilities.checkEmployeeOrAdmin, invController.deleteView)

// Delete inventory action
router.post("/delete/", utilities.checkEmployeeOrAdmin, invController.deleteInventory)

module.exports = router