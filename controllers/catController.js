const errorConfig = require("../config/error.config");
const { getCollection } = require("../utils/helpers");
const { FETCH_URL } = require("../config/index");

class CatController {
  getBatch = async (req, res) => {
    try {
      const collection = await getCollection();

      const cats = await collection
        .find()
        .sort({ created_at: -1 })
        .limit(10)
        .toArray();
      res.send(cats);
    } catch (e) {
      console.log(e);
    }
  };

  getMatch = async (req, res) => {
    try {
      const query = req.query;
      const collection = await getCollection();

      const dbQuery = {};
      if (query.breed) {
        const searchReg = new RegExp(query.breed, "ig");
        dbQuery.breed = searchReg;
      }

      const cats = await collection.find(dbQuery).toArray();
      if (!cats.length) throw errorConfig.catNotFound;
      res.send(cats);
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  };

  getSingle = async (req, res) => {
    try {
      const {
        params: { breed },
      } = req;

      const collection = await getCollection();
      const cat = await collection.findOne({ breed });
      if (!cat) throw errorConfig.catNotFound;

      res.send(cat);
    } catch (e) {
      res.json(e);
    }
  };

  deleteSingle = async (req, res) => {
    try {
      const breed = req.params.breed;
      const collection = await getCollection();

      const cat = await collection.deleteOne({ breed });

      if (!cat.deletedCount) throw errorConfig.catNotFound;
      res.send("Cat was deleted");
    } catch (e) {
      res.json(e);
      console.log(e);
    }
  };

  updateSingle = async (req, res) => {
    try {
      const {
        params: { breed },
        body,
      } = req;

      const collection = await getCollection();

      const updatedCat = await collection.findOneAndUpdate(
        { breed: breed },
        { $set: body },
        { upsert: true, returnDocument: "after" }
      );

      if (!updatedCat.lastErrorObject.updatedExisting) {
        throw errorConfig.catNotFound;
      }

      res.send(updatedCat.value);
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  };

  create = async (req, res) => {
    try {
      const {
        params: { breed },
        body,
      } = req;
      const collection = await getCollection();
      const isExist = await collection.findOne({ breed });
      if (isExist) throw errorConfig.catIsExist;
      const newCat = await collection.insertOne({
        created_at: new Date(),
        breed,
        ...body,
      });
      res.json("Breed was created");
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  };

  fetchBreed = async (req, res) => {
    try {
      const { data } = await (await fetch(FETCH_URL)).json();
      if (!data) throw errorConfig.catServerError;
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
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  };
}

module.exports = new CatController();
