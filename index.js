// const express = require("express");
import express from "express";
import { MongoClient } from "mongodb";
const app = express();
// const { MongoClient } = require("mongodb");
import config from "./config/index.js";

const { PORT } = config();

//import helmet for header
import helmet from "helmet";
// const helmet = require("helmet");

//import routes
import routes from "./routes/index.js";
// const routes = require("./routes/index");
import errorRoute from "./middleware/error.js";
// const errorRoute = require("./middleware/error");

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
// routes(app);
// app.use(errorRoute);

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
