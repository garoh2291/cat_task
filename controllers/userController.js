import userValidator from "../config/validators.js";
import { createUser, signin } from "../utils/helpers.js";

export default function (app) {
  app.post("/signup", userValidator, createUser);
  app.post("/signin", signin);
}
