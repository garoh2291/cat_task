const { Router } = require("express");
const router = Router();
const CatController = require("../controllers/catController");

//fetch breeds from api
router.get("/", CatController.fetchBreed);

module.exports = router;
