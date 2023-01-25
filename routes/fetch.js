const { Router } = require("express");
const router = Router();
const CatController = require("../controllers/catController");
const auth = require("../middleware/authMiddleware");

//fetch breeds from api
router.get("/", auth, CatController.fetchBreed);

module.exports = router;
