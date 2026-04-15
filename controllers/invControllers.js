const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      const err = new Error("Sorry, no vehicles were found for this classification.")
      err.status = 404
      return next(err)
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const invId = req.params.inv_id
    const data = await invModel.getInventoryByInvId(invId)

    if (!data || data.length === 0) {
      const err = new Error("Sorry, the vehicle details could not be found.")
      err.status = 404
      return next(err)
    }

    const vehicle = data[0]
    const nav = await utilities.getNav()
    const details = await utilities.buildDetailsGrid(vehicle)

    res.render("inventory/details", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      details,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      notice: req.flash ? req.flash("notice") : null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()

    res.render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null,
      notice: req.flash ? req.flash("notice") : null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const insertResult = await invModel.addClassification(classification_name)

    if (insertResult) {
      if (req.flash) req.flash("notice", `${classification_name} successfully added.`)
      return res.redirect("/inv")
    }

    const nav = await utilities.getNav()
    res.status(500).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null,
      notice: "Sorry, the classification could not be added.",
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/addInventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      notice: req.flash ? req.flash("notice") : null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body

    const insertResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    )

    if (insertResult) {
      if (req.flash) {
        req.flash("notice", `${inv_make} ${inv_model} was successfully added.`)
      }
      return res.redirect("/inv")
    }

    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    res.status(500).render("inventory/addInventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      notice: "Sorry, the inventory item could not be added.",
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Return inventory JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData && invData.length > 0) {
      return res.json(invData)
    }

    return res.status(404).json([])
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    )
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Update inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      if (req.flash) {
        req.flash("notice", `${inv_make} ${inv_model} was successfully updated.`)
      }
      return res.redirect("/inv")
    }

    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)

    res.status(500).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build delete inventory view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_price: itemData.inv_price,
      inv_year: itemData.inv_year,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Delete inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const invId = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(invId)

    if (deleteResult) {
      if (req.flash) req.flash("notice", "The inventory item was successfully deleted.")
      return res.redirect("/inv")
    }

    if (req.flash) req.flash("notice", "Sorry, the deletion failed.")
    return res.redirect(`/inv/delete/${invId}`)
  } catch (error) {
    next(error)
  }
}
/* ***************************
 * Submit a review
 * ************************** */

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id

  const vehicle = await invModel.getItemById(inv_id)
  const reviews = await reviewModel.getReviewsByInvId(inv_id)

  const detail = await utilities.buildDetailsGrid(vehicle)
  let nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: vehicle.inv_make + " " + vehicle.inv_model,
    nav,
    detail,
    reviews,
    inv_id,
  })
}

invCont.addReview = async function (req, res, next) {
  const { review_text, review_rating, inv_id } = req.body

  try {
    await reviewModel.addReview(review_text, review_rating, inv_id)

    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = invCont