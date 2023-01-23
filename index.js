const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const { MONGODB_URI, PORT, DB } = require("./config/index");

//require routes
const routes = require("./routes/index");
const errorRoute = require("./middleware/error");

app.use(express.json());
//connect routes
routes(app);
app.use(errorRoute);

async function start() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });

  const mycollection = await client.db(DB).collection("cat_breed");
  mycollection.createIndex({ breed: 1 }, { unique: true });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
