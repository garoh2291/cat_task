import { MongoClient } from "mongodb";
import configs from "../config/index.js";
import errorConfig from "../config/error.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

const { MONGODB_URI, DB, SECRET, VALID, FETCH_URL, HASH_LENGTH } = configs;

//Run Db once when code will start
const db = getDb();

//Getbatch method route method
export async function getBatch(req, res) {
  const cats = await findBatch("cat_breed");
  res.send(cats);
}

//Get all cat breeds that match
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

//Get single cat
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

//delete single cat
export async function deleteSingle(req, res) {
  const {
    params: { breed },
  } = req;

  const deletedCat = await removeSingle("cat_breed", { breed });
  if (!deletedCat.deletedCount)
    return res.status(404).json(errorConfig.catNotFound);

  res.send("Cat was deleted");
}

//update single cat
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

//create new cat
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

//fetach cats from api
export async function fetchAll(req, res) {
  try {
    const { data } = await (await fetch(FETCH_URL)).json();
    if (!data) throw errorConfig.catServerError;
    data.map(async (cat) => {
      const collection = await db;
      const isExist = await findOne("cat_breed", { breed: cat.breed });
      if (!isExist) {
        await collection
          .collection("cat_breed")
          .insertOne({ created_at: new Date(), ...cat });
      }
    });
    res.send("Data is fetched");
  } catch (e) {
    console.log(e);
  }
}

//get status
export function getStatus(req, res) {
  return res.status(200).send("You are connected");
}

//get error page
export function errorPage(req, res) {
  return res.send("You are in error page");
}

//create new user
export async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Registration error",
      error: errors.errors[0].msg,
    });
  }
  const { email, password } = req.body;
  const currentDb = await db;

  const candidate = await currentDb.collection("users").findOne({ email });
  if (candidate) {
    return res.status(404).json(errorConfig.userExists);
  }
  const hashPassword = bcrypt.hashSync(password, HASH_LENGTH);

  await currentDb.collection("users").insertOne({
    email,
    password: hashPassword,
  });

  return res.json({ message: "Registrated" });
}

//sign in user
export async function signin(req, res) {
  const { email, password } = req.body;
  const currentDb = await db;
  const candidate = await currentDb.collection("users").findOne({ email });
  if (!candidate) {
    return res.status(404).json(errorConfig.userNotFound);
  }

  const validPassword = bcrypt.compareSync(password, candidate.password);

  if (!validPassword) {
    return res.status(404).json(errorConfig.wrongPasswordError);
  }

  const token = generateAccessToken(candidate._id);

  res.json({ token });
}

///////////////////////MONGO DB

async function findOne(dbCol, obj) {
  const collection = await db;
  return await collection.collection(dbCol).findOne(obj);
}

async function findBatch(dbCol) {
  const collection = await db;
  return await collection
    .collection(dbCol)
    .find()
    .sort({ _id: -1 })
    .limit(10)
    .toArray();
}

async function findMatch(dbCol, query) {
  const collection = await db;
  return await collection.collection(dbCol).find(query).toArray();
}

async function removeSingle(dbCol, deletedObj) {
  const collection = await db;
  return await collection.collection(dbCol).deleteOne(deletedObj);
}

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
  if (isExist) return { error: errorConfig.catIsExist };

  return await collection
    .collection(dbCol)
    .insertOne({ created_at: new Date(), ...newCat });
}

async function getDb() {
  //connect to mongodb
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  return await client.db(DB);
}

/////////////////////////////////
//TOKEN
const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, SECRET, { expiresIn: VALID });
};
