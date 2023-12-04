const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/utils");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create(
      "Token Is Required X=>X",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;

    next();
  } catch (err) {
    const error = appError.create(
      "Token Invalid X=>X",
      401,
      httpStatusText.ERROR
    );
    return next(error);
  }
  // console.log("token => ", token);
  // next();
};

module.exports = verifyToken;
