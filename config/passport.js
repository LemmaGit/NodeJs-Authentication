const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const { userService } = require("./../services");

const JwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
  try {
    if (payload.type != tokenTypes.ACCESS)
      throw new Error("Invalid token type");
    const user = await userService.getUserById(payload.sub);
    // UNAUTHORIZED
    if (!user) return done(null, false);
    // Authentication succeeded
    done(null, user);
  } catch (err) {
    // Error occurs
    done(err, false);
  }
};
const jwtStrategy = new JwtStrategy(JwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
