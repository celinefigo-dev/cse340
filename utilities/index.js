const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model")

const Util = {}

/* ********************************
 * Build navigation
 * ******************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = '<ul class="navigation">'
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
  })

  list += "</ul>"
  return list
}

/* ********************************
 * Build classification grid
 * ******************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid += '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"></a>`
      grid += '<div class="namePrice">'
      grid += "<hr>"
      grid += `<h2><a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

/* ********************************
 * Build details view
 * ******************************** */
Util.buildDetailsGrid = async function (vehicle) {
  if (!vehicle) return '<p class="notice">Vehicle details not found.</p>'

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-detail__info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </section>
  `
}

/* ********************************
 * Build classification list
 * ******************************** */
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classificationList" required>'
  list += '<option value="">Choose a classification</option>'

  data.forEach((row) => {
    list += `<option value="${row.classification_id}"`
    if (Number(classification_id) === Number(row.classification_id)) {
      list += " selected"
    }
    list += `>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}

/* ********************************
 * Middleware to handle errors
 * ******************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ********************************
 * Check JWT and set locals
 * ******************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    res.locals.loggedin = false
    return next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      res.locals.loggedin = false
      res.clearCookie("jwt")
      return next()
    }

    res.locals.loggedin = true
    res.locals.accountData = accountData
    next()
  })
}

/* ********************************
 * Check Employee or Admin
 * ******************************** */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    res.locals.accountData &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "Please log in with an Employee or Admin account.")
  return res.status(403).render("account/login", {
    title: "Login",
    nav: res.locals.nav,
    errors: null,
    account_email: "",
  })
}

module.exports = Util