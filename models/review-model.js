const pool = require("../database")

async function getReviewsByInvId(inv_id) {
  try {
    const sql = "SELECT * FROM review WHERE inv_id = $1 ORDER BY review_id DESC"
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInvId error:", error)
    return []
  }
}

async function addReview(review_text, review_rating, inv_id) {
  try {
    const sql = `
      INSERT INTO review (review_text, review_rating, inv_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const result = await pool.query(sql, [review_text, review_rating, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error:", error)
    return null
  }
}

module.exports = {
  getReviewsByInvId,
  addReview,
}