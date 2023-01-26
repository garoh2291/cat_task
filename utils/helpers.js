import { MongoClient } from "mongodb";
import configs from "../config/index.js";
import errorConfig from "../config/error.config.js";
import jwt from "jsonwebtoken";

const { MONGODB_URI, DB, SECRET, VALID, FETCH_URL } = configs();

//Run Db once when code will start
const db = getDb();

export async function getBatch(req, res) {
  const cats = await findBatch("cat_breed");
  res.send(cats);
}

export async function getMatch(req, res) {
  const query = req.query;
  const dbQuery = {};
  if (query.breed) {
    const searchReg = new RegExp(query.breed, "ig");
    dbQuery.breed = searchReg;
  }

  const cats = await findMatch("cat_breed", dbQuery);
  if (!cats.length) return res.status(404).json(errorConfig.catNotFound);

  res.send(cats);
}

export async function getSingle(req, res) {
  try {
    const {
      params: { breed },
    } = req;
    const cat = await findOne("cat_breed", { breed });
    if (!cat) return res.status(404).json(errorConfig.catNotFound);
    res.send(cat);
  } catch (e) {
    return res.status(404).json(e);
  }
}

export async function deleteSingle(req, res) {
  const {
    params: { breed },
  } = req;

  const deletedCat = await removeSingle("cat_breed", { breed });
  if (!deletedCat.deletedCount)
    return res.status(404).json(errorConfig.catNotFound);

  res.send("Cat was deleted");
}

export async function updateSingle(req, res) {
  const {
    params: { breed },
    body,
  } = req;

  const updatedCat = await updateSingleFromDb("cat_breed", { breed }, body);

  if (!updatedCat.lastErrorObject.updatedExisting) {
    return res.status(404).json(errorConfig.catNotFound);
  }
  res.send(updatedCat.value);
}

export async function create(req, res) {
  const {
    params: { breed },
    body,
  } = req;

  console.log(body, breed);
  const created = await createSingle("cat_breed", { breed, ...body });

  // console.log(created);
  if (created.error) {
    return res.status(404).json(created.error);
  }

  res.json("Breed was created");
}

////////////
async function findOne(dbCol, obj) {
  const collection = await db;
  return await collection.collection(dbCol).findOne(obj);
}

//will find batch cats and return
async function findBatch(dbCol) {
  const collection = await db;
  return await collection
    .collection(dbCol)
    .find()
    .sort({ _id: -1 })
    .limit(10)
    .toArray();
}

//will find cats wich breeds contains query
async function findMatch(dbCol, query) {
  const collection = await db;
  return await collection.collection(dbCol).find(query).toArray();
}

//will find and remove cat from params
async function removeSingle(dbCol, deletedObj) {
  const collection = await db;
  return await collection.collection(dbCol).deleteOne(deletedObj);
}

//
async function updateSingleFromDb(dbCol, updatedBreed, updatedObj) {
  const collection = await db;
  return collection
    .collection(dbCol)
    .findOneAndUpdate(
      updatedBreed,
      { $set: updatedObj },
      { upsert: true, returnDocument: "after" }
    );
}

async function createSingle(dbCol, newCat) {
  const collection = await db;

  const isExist = await findOne(dbCol, { breed: newCat.breed });
  // console.log(isExist);
  if (isExist) return { error: errorConfig.catIsExist };

  return await collection
    .collection(dbCol)
    .insertOne({ created_at: new Date(), ...newCat });
}

async function fetchBreeds(dbCol) {
  const { data } = await (await fetch(FETCH_URL)).json();
  if (!data) errorConfig.catServerError;

  data.map(async (cat) => {
    const isExist = await findOne(dbCol, { breed: cat.breed });
    if (!isExist) {
      await createSingle(dbCol, cat);
    }
  });
}

async function getDb() {
  //connect to mongodb
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  return await client.db(DB);
}

// async function getUsers() {
//   //connect to mongodb and return users collection
//   const client = await MongoClient.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//   });
//   // return await client.db(DB).collection("users");
// }

const generateAccessToken = (id) => {
  //take passed id and return generated token
  const payload = {
    id,
  };
  return jwt.sign(payload, SECRET, { expiresIn: VALID });
};
