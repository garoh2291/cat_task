const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB } = require("../config/index");
const uri =
  "mongodb+srv://Garnik:Aa123456@cluster0.qhryhu1.mongodb.net/test/db";

async function getCollection() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  return await client.db(DB).collection("cat_breed");
}

module.exports = {
  getCollection,
};
