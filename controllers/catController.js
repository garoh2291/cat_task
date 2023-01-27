import auth from "../middleware/authMiddleware.js";
import {
  getBatch,
  getMatch,
  getSingle,
  deleteSingle,
  updateSingle,
  create,
  fetchAll,
  getStatus,
  errorPage,
} from "../utils/helpers.js";

export default function (app) {
  app.get("/", auth, getBatch);
  app.get("/fetch", auth, fetchAll);
  app.get("/match", auth, getMatch);
  app.get("/status", getStatus);
  app.get("/not_found", errorPage);
  app.get("/:breed", auth, getSingle);
  app.delete("/:breed", auth, deleteSingle);
  app.put("/:breed", auth, updateSingle);
  app.post("/:breed", auth, create);
}
