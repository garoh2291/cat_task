const errorConfig = require("../config/error.config");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { getUsers, generateAccessToken } = require("../utils/helpers");
const { HASH_LENGTH } = require("../config/index");

class UserController {
  signUp = async (req, res) => {
    try {
      //validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Registration error",
          error: errors.errors[0].msg,
        });
      }
      const { email, password } = req.body;
      //get users collection
      const collection = await getUsers();

      //check if there is user with email from body
      const candidate = await collection.findOne({ email });
      if (candidate) {
        //if there is an user with provided email throw error
        throw errorConfig.userExists;
      }

      //make hashed password
      const hashPassword = bcrypt.hashSync(password, HASH_LENGTH);

      //add new user to DB with email and hashed password
      await collection.insertOne({
        email,
        password: hashPassword,
      });

      return res.json({ message: "Registrated" });
    } catch (e) {
      return res.status(404).json(e);
    }
  };

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;

      //get users collection
      const collection = await getUsers();

      //check if there is user with email from body
      const candidate = await collection.findOne({ email });

      if (!candidate) {
        //if there is no user with provided email throw error
        throw errorConfig.userNotFound;
      }

      //compare password from body with hashed password
      const validPassword = bcrypt.compareSync(password, candidate.password);

      if (!validPassword) {
        //if passwords are not the same throw error
        throw errorConfig.wrongPasswordError;
      }

      //generate token with user id
      const token = generateAccessToken(candidate._id);

      //send back token
      res.json({ token });
    } catch (e) {
      return res.status(404).json(e);
    }
  };
}

module.exports = new UserController();
