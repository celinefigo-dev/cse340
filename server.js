const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

const inventoryRoute = require("./routes/inventoryRoutes")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
  res.locals.messages = () => ""
  next()
})

app.use("/inv", inventoryRoute)

app.get("/", async (req, res, next) => {
  try {
    res.render("index", {
      title: "Home | CSE Motors",
    })
  } catch (error) {
    next(error)
  }
})

app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 | Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
  })
})

app.use((err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}": ${err.message}`)
  res.status(err.status || 500).render("errors/error", {
    title: `${err.status || 500} | Server Error`,
    message: err.message || "Something went wrong.",
  })
})

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`)
})