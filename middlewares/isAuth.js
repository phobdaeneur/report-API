const issueJWT = require("../utils/issueJWT");
const ApiError = require("../error/ApiError");

module.exports = async (req, res, next) => {
  // extract bearer token
  const bearer = req.header("authorization");

  if (!bearer) {
    next(ApiError.unauthorized("Invalid token!"));
    return
  }
  const token = bearer.substring(7);

  try {
    const verifiedToken = await issueJWT.verifyAccessToken(token);
    /**
     * TODO: for more security reasons, verifiedToken.data might need to auth in db
     */
    if (verifiedToken) {
      next();
    }
  } catch (err) {
    next(err);
  }
};
