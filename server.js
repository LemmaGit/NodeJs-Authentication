const express = require("express");
const passport = require("passport");
const httpStatus = require("http-status");
const morgan = require("./config/morgan");

const app = express();

const blogRouter = require("./routes/blog.route");
const authRouter = require("./routes/auth.route");
const { errorHandler, errorConverter } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const { jwtStrategy } = require("./config/passport");

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
// JWT authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
app.use(express.json());
app.use(blogRouter);
app.use(authRouter);
// Path not found
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
