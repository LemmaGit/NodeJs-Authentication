const passport = require("passport");
const ApiError = require("./../utils/ApiError");
const httpStatus = require("http-status");

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || !user || info)
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  req.user = user;
  resolve();
};
// passport.authenticate
//     1 - Extracts the JWT from Authorization: Bearer <token> using the strategy’s extractor.
//     2 - Verifies signature using secretOrKey
//     3 -Decodes the payload and calls your jwtVerify(payload, done) (the Passport strategy verify function).

// Passport receives done(...) and then calls your verifyCallback(req, resolve, reject) with (err, user, info)
const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((error) => next(error));
};

module.exports = auth;
