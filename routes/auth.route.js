const express = require("express");
const router = express.Router();
const validate = require("./../middlewares/validate");
const { userValidation, authValidation } = require("./../validations");
const { authController } = require("./../controllers");
const auth = require("./../middlewares/auth");

router.post(
  "/auth/register",
  validate(userValidation.createUserSchema),
  authController.register
);
router.post(
  "/auth/login",
  validate(authValidation.loginSchema),
  authController.login
);
// router.use(auth);
router.post(
  "/auth/refresh-token",
  validate(authValidation.refreshTokenSchema),
  authController.refreshAuthToken
);

module.exports = router;
