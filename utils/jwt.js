const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = async (payload) => {
  /**
   * @param {string} str password string to sign as jwt token
   */
  const { SECRET_KEY } = process.env;

  try {
    const signedToken = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        data: payload,
      },
      SECRET_KEY,
      {
        algorithm: "HS256",
      }
    );

    return signedToken;
  } catch (err) {
    throw err;
  }
};

// const signRefreshToken = async (str) => {};

// const verifyAccessToken = async (token) => {};

module.exports = { signAccessToken };
