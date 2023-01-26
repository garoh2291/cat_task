import auth from "../middleware/authMiddleware.js";
import {
  getBatch,
  getMatch,
  getSingle,
  deleteSingle,
  updateSingle,
  create,
} from "../utils/helpers.js";

export default function (app) {
  app.get("/", getBatch);
  app.get("/match", getMatch);
  app.get("/:breed", getSingle);
  app.delete("/:breed", deleteSingle);
  app.put("/:breed", updateSingle);
  app.post("/:breed", create);
}

// const errorConfig = require("../config/error.config");
// const { getCollection } = require("../utils/helpers");
// const { FETCH_URL } = require("../config/index");

//   create = async (req, res) => {
//     try {
//       const {
//         params: { breed },
//         body,
//       } = req;
//       const collection = await getCollection();
//       const isExist = await collection.findOne({ breed });
//       if (isExist) throw errorConfig.catIsExist;
//       const newCat = await collection.insertOne({
//         created_at: new Date(),
//         breed,
//         ...body,
//       });
//       res.json("Breed was created");
//     } catch (e) {
//       console.log(e);
//       return res.status(404).json(e);
//     }
//   };

//   fetchBreed = async (req, res) => {
//     try {
//       const { data } = await (await fetch(FETCH_URL)).json();
//       if (!data) throw errorConfig.catServerError;
//       const collection = await getCollection();

//       data.map(async (cat) => {
//         const isExist = await collection.findOne({ breed: cat.breed });
//         if (!isExist) {
//           await collection.insertOne({
//             created_at: new Date(),
//             ...cat,
//           });
//         }
//       });

//       res.send("Data is fetched");
//     } catch (e) {
//       console.log(e);
//       return res.status(404).json(e);
//     }
//   };
// }
