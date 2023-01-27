import express from "express";
import helmet from "helmet";
import config from "./config/index.js";
import errorRoute from "./middleware/error.js";
import catController from "./controllers/catController.js";
import userController from "./controllers/userController.js";

const { PORT } = config;
const app = express();

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
userController(app);
catController(app);
app.use(errorRoute);

async function start() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
