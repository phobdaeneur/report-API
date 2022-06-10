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
    const result = await pool_zbq.query(`
      SELECT *
      FROM [ZebraDB].[dbo].[staff] a
      left join [ZebraDB].[dbo].[profile_fleet] b on a.profile_id = b.profile_id
      left join [ZebraDB].[dbo].[fleet] c on b.fleet_id = c.fleet_id
      where login_name = 'administrator'
    `);
    console.log(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
