const { Router } = require("express");
const userController = require("../controllers/userController");
const router = Router();
const { userValidator } = require("../config/validators");

//register new user route
router.post("/", userValidator, userController.signUp);

module.exports = router;
