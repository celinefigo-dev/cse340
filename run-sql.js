const fs = require("fs")
const path = require("path")
const pool = require("./database")

async function runSqlFile(fileName) {
  try {
    const filePath = path.join(__dirname, "database", fileName)
    const sql = fs.readFileSync(filePath, "utf8")
    await pool.query(sql)
    console.log(`${fileName} ran successfully`)
    process.exit()
  } catch (error) {
    console.error("SQL run error:", error)
    process.exit(1)
  }
}

// Change the file name if needed
runSqlFile("db-rebuild-code.sql")