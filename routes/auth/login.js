const express = require("express");
const router = express.Router();
const { pool_zb_log } = require("../../config/db");

/* POST login */
router.get("/", async (req, res, next) => {
  /**
   * TODO: get username unhash password and compare
   */
  try {
    const pool_zb_logq = await pool_zb_log();
    const result = await pool_zb_logq.query(``);
    console.log(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
