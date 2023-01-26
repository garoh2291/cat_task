const { check } = require("express-validator");

exports.userValidator = [
  check("email", "Write correct email").isEmail().normalizeEmail(),
  check("password", "Password must be minimum 6 characters")
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(),
];