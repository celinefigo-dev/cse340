const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const utilities = require("./utilities")

dotenv.config()

const app = express()

// IMPORTANT for Render (HTTPS)
app.set("trust proxy", 1)

const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

// Routes
const staticRoute = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoutes")
const accountRoute = require("./routes/accountRoute")
const appointmentRoute = require("./routes/appointmentRoute")

// View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

// Body parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Cookies
app.use(cookieParser())

// Session (FIXED)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // IMPORTANT for Render
      httpOnly: true,
      sameSite: "lax",
    },
  })
)

// Flash messages
app.use(flash())

// JWT Middleware (ONLY ONCE ✅)
app.use(utilities.checkJWTToken)

// Navigation
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    next()
  } catch (error) {
    next(error)
  }
})

// Routes
app.use("/", staticRoute)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/appointments", appointmentRoute)

// 404
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 | Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    nav: res.locals.nav || "",
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`)
  res.status(err.status || 500).render("errors/error", {
    title: `${err.status || 500} | Server Error`,
    message: err.message || "Something went wrong.",
    nav: res.locals.nav || "",
  })
})

// Server
app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`)
})