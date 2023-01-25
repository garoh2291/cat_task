const { Router } = require("express");
const userController = require("../controllers/userController");
const router = Router();

//check user existance route
router.post("/", userController.signIn);

module.exports = router;
