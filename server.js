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
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

const staticRoute = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoutes")
const accountRoute = require("./routes/accountRoute")
const appointmentRoute = require("./routes/appointmentRoute")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "week5-secret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())

app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    next()
  } catch (error) {
    next(error)
  }
})

app.use(utilities.checkJWTToken)

app.use("/", staticRoute)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/appointments", appointmentRoute)

app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 | Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    nav: res.locals.nav || "",
  })
})

app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`)
  res.status(err.status || 500).render("errors/error", {
    title: `${err.status || 500} | Server Error`,
    message: err.message || "Something went wrong.",
    nav: res.locals.nav || "",
  })
})

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`)
})