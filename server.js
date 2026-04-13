/* ******************************************
 * CSE Motors - Assignment 1 Server
 * Basic Express setup for EJS views
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.set("views", "./views");

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"));

/* ***********************
 * Routes
 *************************/
app.get("/", (req, res) => {
  res.render("index", { title: "Home | CSE Motors" });
});

// 404 route (must be last)
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found | CSE Motors" });
});

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT 
const host = process.env.HOST 
app.listen(port, () => {
  console.log(`✅ Server running at http://${host}:${port}`);
});