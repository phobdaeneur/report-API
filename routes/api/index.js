const express = require("express");
const router = express.Router();
// const { poolPromise } = require("../../config/db");
const { pool_zb } = require("../../config/db");

/* POST api/? */
router.get("/", async (req, res, next) => {
  /**
   * TODO: Extract login role and make query accordingly.
   */

  try {
    const pool_zbq = await pool_zb();
    const result = await pool_zbq.query(``);
    console.log(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
