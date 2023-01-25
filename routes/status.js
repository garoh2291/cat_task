const { Router } = require("express");
const router = Router();

//check connection route
router.get("/", (req, res) => {
  res.status(200).send("You are connected");
});

module.exports = router;
