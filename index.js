// const express = require("express");
import express from "express";
import helmet from "helmet";
import config from "./config/index.js";
import errorRoute from "./middleware/error.js";
import catController from "./controllers/catController.js";

const { PORT } = config();
const app = express();

//import helmet for header

//to parse request body
app.use(express.json());

//connect helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

//connect routes
catController(app);
app.use(errorRoute);

async function start() {
  // const client = await MongoClient.connect(MONGODB_URI, {
  //   useNewUrlParser: true,
  // });

  // const mycollection = await client.db(DB).collection("cat_breed");
  // mycollection.createT
  // mycollection.createIndex({ breed: 1 }, { unique: true }); //no need every time

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
