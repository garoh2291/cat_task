const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB } = require("../config/index");

async function getCollection() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  return await client.db(DB).collection("cat_breed");
}

module.exports = {
  getCollection,
};
