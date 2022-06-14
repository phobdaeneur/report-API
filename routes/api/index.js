const express = require("express");
const router = express.Router();
// const { poolPromise } = require("../../config/db");
const { pool_zb, pool_zb_log } = require("../../config/db");
const ApiError = require("../../error/ApiError");

/* GET api/? */
router.get("/fleets", async (req, res, next) => {
  const { fleetName } = req.body;

  try {
    const pool_zbq = await pool_zb();
    const result = await pool_zbq.query(`
      SELECT c.fleet_id
      ,c.fleet_desc
      FROM [ZebraDB].[dbo].[staff] a
      left join [ZebraDB].[dbo].[profile_fleet] b on a.profile_id = b.profile_id
      left join [ZebraDB].[dbo].[fleet] c on b.fleet_id = c.fleet_id
      where login_name = 'Toe'
    `);

    console.log(result);
    res.status(200).json(result.recordset);
  } catch (err) {
    next(err);
  }
});

router.post("/fleet/vehicles", async (req, res, next) => {
  const { fleetId } = req.body;

  if (!fleetId) {
    next(ApiError.badRequest("Invalid credentials!"));
    return;
  } else {
    try {
      const pool_zbq = await pool_zb();
      const pool_zb_logq = await pool_zb_log();

      const result = await pool_zbq.query(`
      SELECT a.fleet_id
      ,a.veh_id
      ,d.registration
      ,b.lat
      ,b.lon
      ,c.local_timestamp
      ,c.speed
      ,c.name
      ,c.namt
      ,b.distance
      ,e.evt_id
      ,case 
      when isnull(e.evt_id,12) = 2 then 'SPEEDING'
      when isnull(e.evt_id,12) = 3 then 'IDLE'
      when isnull(e.evt_id,12) = 23 or ISNULL(ZebraDB.dbo.IsEngineOnTheLastByTime_Log(a.veh_id ,c.local_timestamp),0) = 0 then 'ENGINE OFF'
      when e.evt_id not in (2,3,23) and isnull(c.local_timestamp,GETDATE()-30) < GETDATE()-7 then 'OFFLINE'
      --when (e.evt_id is null or e.evt_id not in (2,3,23)) and isnull(c.local_timestamp,GETDATE()-30) > GETDATE()-7 then 'NORMAL'
      else 'NORMAL'
      end as Status
        FROM  [ZebraDB].[dbo].[fleet_vehicle] a
        left join [ZebraDB_Log].[dbo].[veh_current_location] b on a.veh_id =b.veh_id
        left join [ZebraDB_Log].[dbo].[log_msg] c on b.ref_idx = c.idx
        left join [ZebraDB].[dbo].[vehicle] d on a.veh_id = d.veh_id
        Left join [ZebraDB_Log].[dbo].[veh_current_event] e on c.idx = e.ref_idx
        where a.fleet_id = ${parseInt(fleetId)}
    `);

      console.log(result);
      res.status(200).json(result.recordset);
    } catch (err) {
      next(err);
    }
  }
});

module.exports = router;
