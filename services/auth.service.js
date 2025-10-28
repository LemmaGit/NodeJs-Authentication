const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("./../utils/ApiError");
const tokenService = require("./token.service");
const { tokenTypes } = require("../config/tokens");

const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password)))
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  return user;
};
const refreshAuthToken = async (refreshToken) => {
  try {
    // check if the provided token is valid
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    // if the user does not exist then throw an error
    if (!user) throw new Error();
    // id the user exists then remove the old and generate new refresh token
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user.id);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

module.exports = {
  login,
  refreshAuthToken,
};
