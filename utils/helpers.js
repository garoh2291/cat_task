const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB, SECRET, VALID } = require("../config/index");
const jwt = require("jsonwebtoken");

async function getCollection() {
  //connect to mongodb and return cat_breed collection
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  return await client.db(DB).collection("cat_breed");
}

async function getUsers() {
  //connect to mongodb and return users collection
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  return await client.db(DB).collection("users");
}

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
