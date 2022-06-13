const express = require("express");
const router = express.Router();
// const { poolPromise } = require("../../config/db");
const { pool_zb } = require("../../config/db");
const ApiError = require("../../error/ApiError");

/* GET api/? */
router.get("/fleet", async (req, res, next) => {
  const { fleetName } = req.body;

  try {
    const pool_zbq = await pool_zb();
    const result = await pool_zbq.query(`
      SELECT *
      FROM [ZebraDB].[dbo].[staff] a
      left join [ZebraDB].[dbo].[profile_fleet] b on a.profile_id = b.profile_id
      left join [ZebraDB].[dbo].[fleet] c on b.fleet_id = c.fleet_id
      where login_name = 'Toe'
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    next(err);
  }
});

router.post("/fleet/vehicles", async (req, res, next) => {
  const { fleetId } = req.body;

  console.log("hi fleet/vehicles")
  console.log(req.body)

  if (!fleetId) {
    next(ApiError.badRequest("Invalid credentials!"));
    return 
  }else {
    try {
    const pool_zbq = await pool_zb();
    // const pool_zb_logq = await pool_zb_log();

    /**
     * ? This query contains two databases data joining
     * ? Does it automatically connected to another database after config pooling?
     * ? by invoking 1 database
     */
    const result = await pool_zbq.query(`
    SELECT *
    FROM  [ZebraDB].[dbo].[fleet_vehicle] a
    left join [ZebraDB_Log].[dbo].[veh_current_location] b on a.veh_id =b.veh_id
    left join [ZebraDB_Log].[dbo].[log_msg] c on b.ref_idx = c.idx
    where a.fleet_id = ${parseInt(fleetId)}
    `);

    console.log(result.recordset);
    res.status(200).json(result.recordset);
  } catch (err) {
    next(err);
  }
  }
});

module.exports = router;
