const pool = require("../database")

async function getClassifications() {
  const result = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
  return result.rows
}

async function getInventoryByClassificationId(classification_id) {
  const result = await pool.query(
    "SELECT * FROM public.inventory WHERE classification_id = $1",
    [classification_id]
  )
  return result.rows
}

async function getInventoryByInvId(inv_id) {
  const result = await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
  )
  return result.rows
}

async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error:", error)
    return null
  }
}

async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql = `
      INSERT INTO public.inventory
      (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const result = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}

async function getInventoryById(inv_id) {
  const result = await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
  )
  return result.rows[0]
}

async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory SET
      inv_make = $2,
      inv_model = $3,
      inv_description = $4,
      inv_image = $5,
      inv_thumbnail = $6,
      inv_price = $7,
      inv_year = $8,
      inv_miles = $9,
      inv_color = $10,
      classification_id = $11
      WHERE inv_id = $1
      RETURNING *
    `
    const result = await pool.query(sql, [
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("updateInventory error:", error)
    return null
  }
}

async function deleteInventoryItem(inv_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return result.rowCount
  } catch (error) {
    console.error("deleteInventoryItem error:", error)
    return null
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  addClassification,
  addInventory,
  getInventoryById,
  updateInventory,
  deleteInventoryItem,
}