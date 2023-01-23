const { Router } = require("express");
const router = Router();
const { getCollection } = require("../utils/helpers");

router.get("/", async (req, res) => {
  const collection = await getCollection();
  const cats = await collection
    .find()
    .sort({ created_at: -1 })
    .limit(10)
    .toArray();
  res.send(cats);
});

router.get("/match", async (req, res) => {
  const query = req.query;
  const collection = await getCollection();

  const dbQuery = {};
  if (query.breed) {
    const searchReg = new RegExp(query.breed, "ig");
    dbQuery.breed = searchReg;
  }

  const cats = await collection.find(dbQuery).toArray();
  res.send(cats);
});

router.get("/:breed", async (req, res, next) => {
  const breed = req.params.breed;
  const collection = await getCollection();

  try {
    const cats = await collection.findOne({ breed });

    if (!cats) {
      throw new Error("not found");
    }
    res.send(cats);
  } catch (e) {
    // next(e);
    res.redirect("/not_found");
  }
});

router.delete("/:breed", async (req, res) => {
  const breed = req.params.breed;
  const collection = await getCollection();
  const cats = await collection.deleteOne({ breed });

  res.send(cats);
});

router.put("/:breed", async (req, res) => {
  const breed = req.params.breed;
  const body = req.body;
  const collection = await getCollection();
  const updatedCat = await collection.findOneAndUpdate(
    { breed: breed },
    { $set: body }
  );

  res.send("Changed");
});

router.post("/:breed", async (req, res, next) => {
  const breed = req.params.breed;
  const body = req.body;
  const collection = await getCollection();
  try {
    const isExist = await collection.findOne({ breed });
    if (isExist) throw new Error("Duplicated breed");
    const newCat = await collection.insertOne({
      created_at: new Date(),
      breed,
      ...body,
    });

    res.json(newCat);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
