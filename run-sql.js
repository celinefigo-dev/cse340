const db = require("./database");
const fs = require("fs");

const sql = fs.readFileSync("./database/assignment2.sql", "utf8");

db.query(sql)
  .then((result) => {
    console.log("SQL executed successfully");
    console.log("Result:", result.rows); // Log rows if any, e.g., from SELECT
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error executing SQL:", err);
    process.exit(1);
  });