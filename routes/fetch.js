const { Router } = require("express");
const router = Router();
const { getCollection } = require("../utils/helpers");
const { FETCH_URL } = require("../config/index");

router.get("/", async (req, res, next) => {
  const { data } = await (await fetch(FETCH_URL)).json();
  const collection = await getCollection();

  data.map(async (cat) => {
    const isExist = await collection.findOne({ breed: cat.breed });
    if (!isExist) {
      await collection.insertOne({
        created_at: new Date(),
        ...cat,
      });
    }
  });

  res.send("Data is fetched");
});

module.exports = router;
