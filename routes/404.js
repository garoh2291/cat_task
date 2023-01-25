const { Router } = require("express");
const router = Router();

//error route
router.get("/", (req, res) => {
  res.send("You are in error page");
});

module.exports = router;
