const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB, SECRET, VALID } = require("../config/index");
const jwt = require("jsonwebtoken");

//Run Db once when code will start
const db = getDb();

async function findOne(collection, obj) {
  const collection = await db.collection(collection);
  return await collection.findOne(obj);
}

async function findBatch(collection) {
  const collection = await db.collection(collection);
  return await collection.find().sort({ _id: -1 }).limit(10).toArray();
}

async function findMatch(collection, query) {
  const collection = await db.collection(collection);
  return await collection.find(query).toArray();
}

async function deleteSingle(collection, deletedObj) {
  const collection = await db.collection(collection);
  return await collection.deleteOne(deletedObj);
}

async function updateSingle(collection, updatedBreed, updatedObj) {
  const collection = await db.collection(collection);
  return collection.findOneAndUpdate(
    updatedBreed,
    { $set: updatedObj },
    { upsert: true, returnDocument: "after" }
  );
}

async function createSingle(collection, body) {
  const isExist = await findOne(collection, { breed: body.breed });
  if (isExist) console.log("EXIST");

  return await collection.insertOne({ created_at: new Date(), ...body });
}

async function fetchBreeds(collection) {
  const { data } = await (await fetch(FETCH_URL)).json();
  if (!data) errorConfig.catServerError;

  data.map(async (cat) => {
    const isExist = await findOne(collection, { breed: cat.breed });
    if (!isExist) {
      await createSingle(collection, cat);
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

module.exports = {
  getCollection,
  getUsers,
  generateAccessToken,
};
