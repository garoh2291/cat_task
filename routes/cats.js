const { Router } = require("express");
const router = Router();
const CatController = require("../controllers/catController");
const auth = require("../middleware/authMiddleware");

//get the last 10 inserted into the DB
router.get("/", auth, CatController.getBatch);

//get breeds with query params
router.get("/match", auth, CatController.getMatch);

//get single breed
router.get("/:breed", auth, CatController.getSingle);

//delete single breed
router.delete("/:breed", auth, CatController.deleteSingle);

//update single breed
router.put("/:breed", auth, CatController.updateSingle);

//create new breed
router.post("/:breed", auth, CatController.create);

module.exports = router;
