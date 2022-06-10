const express = require("express");
const router = express.Router();
const { pool_zb } = require("../../config/db");
const ApiError = require("../../error/ApiError");
const md5 = require("md5");

/* POST login */
router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    next(ApiError.badRequest("Invalid username or password!"));
  }
  try {
    const pool_zbq = await pool_zb();
    const user = await pool_zbq.query(`
    SELECT *
    FROM [ZebraDB].[dbo].[staff]
    where login_name = '${username}'
    `);

    if (!user.recordset.length) {
      res.status(401).json("Invalid username!");
    }

    /**
     * * hash MD5 and compare with retrieved hash
     */
    const hashMD5 = md5(password.toString()).toUpperCase();
    if (user.recordset[0].login_pwd.replace(/-/g, "") !== hashMD5) {
      res.status(401).json("Invalid password!");
    }
    res.status(200).json("Successfully Authenticated! :)");

    /**
     * * set JWT in cookie for authentication
     */
  } catch (err) {
    next(err);
  }
});

module.exports = router;
