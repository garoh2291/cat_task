const jwt = require("jsonwebtoken");
const errorConfig = require("../config/error.config");
const { SECRET } = require("../config/index");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
      //if autorization is undefined throw error
      return res.status(401).json({ error: errorConfig.notAuthorized });
    }

    const bearer = token.split(" ");

    //if authorization first word is not bearer or second is undefined throw error
    if (
      bearer[0].toLowerCase() !== "bearer" ||
      typeof bearer[1] === "undefined"
    ) {
      return res.status(401).json({ error: errorConfig.bearerInvalid });
    }

    token = bearer[1];

    //decode token and get user _id
    const decodedData = jwt.verify(token, SECRET);

    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status.json({ error: errorConfig.notAuthorized });
  }
};
