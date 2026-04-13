/* ******************************************
 * CSE Motors
 * Express server setup
 *******************************************/

/* ***********************
 * Require Packages
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const dotenv = require("dotenv")

/* ***********************
 * Load Environment Variables
 *************************/
dotenv.config()

/* ***********************
 * Create App
 *************************/
const app = express()

/* ***********************
 * App Settings
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Prevent EJS messages error
 *************************/
app.use((req, res, next) => {
  res.locals.messages = () => ""
  next()
})

/* ***********************
 * Routes
 *************************/
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home | CSE Motors",
  })
})

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 | Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
  })
})

/* ***********************
 * Error Handler
 *************************/
app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: err.message || "Something went wrong.",
  })
})

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`✅ Server running at http://${host}:${port}`)
})