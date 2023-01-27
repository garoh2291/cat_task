import jwt from "jsonwebtoken";
import errorConfig from "../config/error.config.js";
import configs from "../config/index.js";

const { SECRET } = configs;

export default (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
      return res.status(401).json({ error: errorConfig.notAuthorized });
    }

    const bearer = token.split(" ");

    if (
      bearer[0].toLowerCase() !== "bearer" ||
      typeof bearer[1] === "undefined"
    ) {
      return res.status(401).json({ error: errorConfig.bearerInvalid });
    }

    token = bearer[1];

    const decodedData = jwt.verify(token, SECRET);

    req.user = decodedData;
    next();
  } catch (e) {
    return res.status(401).json({ error: errorConfig.notAuthorized });
  }
};
