const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Please choose a classification."),
    body("inv_make").trim().notEmpty().withMessage("Please provide a make."),
    body("inv_model").trim().notEmpty().withMessage("Please provide a model."),
    body("inv_description").trim().notEmpty().withMessage("Please provide a description."),
    body("inv_image").trim().notEmpty().withMessage("Please provide an image path."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Please provide a thumbnail path."),
    body("inv_price").notEmpty().withMessage("Please provide a price."),
    body("inv_year").notEmpty().withMessage("Please provide a year."),
    body("inv_miles").notEmpty().withMessage("Please provide mileage."),
    body("inv_color").trim().notEmpty().withMessage("Please provide a color."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/addInventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      notice: null,
      ...req.body,
    })
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect,
      errors: errors.array(),
      ...req.body,
    })
  }
  next()
}

module.exports = validate