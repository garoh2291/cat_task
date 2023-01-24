const { Router } = require("express");
const router = Router();
const CatController = require("../controllers/catController");

//get the last 10 inserted into the DB
router.get("/", CatController.getBatch);

//get breeds with query params
router.get("/match", CatController.getMatch);

//get single breed
router.get("/:breed", CatController.getSingle);

//delete single breed
router.delete("/:breed", CatController.deleteSingle);

//update single breed
router.put("/:breed", CatController.updateSingle);

//create new breed
router.post("/:breed", CatController.create);

module.exports = router;
