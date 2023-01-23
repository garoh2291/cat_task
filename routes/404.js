const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.send("Cat is not found");
});

module.exports = router;
