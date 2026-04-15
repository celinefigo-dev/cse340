const pool = require("./database")

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()")
    console.log("Database connected successfully")
    console.log(result.rows[0])
    process.exit()
  } catch (error) {
    console.error("Database connection failed:")
    console.error(error.message)
    process.exit(1)
  }
}

testConnection()