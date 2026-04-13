/* ******************************************
 * CSE Motors
 * Basic Express setup for EJS views
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const dotenv = require("dotenv")
const path = require("path")
const session = require("express-session")
const pool = require('./database/')

// Load environment variables
dotenv.config()

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.set("views", path.join(__dirname, "views"))

/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home | CSE Motors",
  })
})

/* ***********************
 * 404 Route
 *************************/
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found | CSE Motors",
    message: "Sorry, the page you are looking for does not exist.",
  })
})



/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`✅ Server running at http://${host}:${port}`)
})