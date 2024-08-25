const { ObjectId } = require("bson");
const User = require("../models/User");
const { getToken } = require("../helpers/jwt");
const { getHashedString, isStringRelevant } = require("../helpers/bcrypt");
const { CustomError } = require("../middlewares/Errorhandler");

class AuthController {
  static async signIn(req, res, next) {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (!existingUser || !isStringRelevant(password, existingUser.password)) {
        throw new CustomError(403, "Wrong username or password");
      }

      res.status(200).json({
        token: getToken(existingUser),
        user: { username, displayName: existingUser.displayName, role: existingUser.role, _id: existingUser._id },
      });
    } catch (error) {
      next(error);
    }
  }

  static async signUp(req, res, next) {
    try {
      const { username, password, displayName, role } = req.body;

      const existedUser = await User.findOne({ username });
      if (existedUser) throw new CustomError(400, "username is taken");

      const { insertedId } = await User.create({ username, password: getHashedString(password), displayName, role });
      const existingUser = await User.findOne({ _id: new ObjectId(insertedId) });

      res.status(201).json({ token: getToken(existingUser), user: { username, displayName, role, _id: existingUser._id } });
    } catch (error) {
      next(error);
    }
  }

  static async userInfo(req, res, next) {
    try {
      res.status(200).json(res.locals.user);
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentPassword(req, res, next) {
    try {
      const userId = res.locals.user._id; // Assuming the user is authenticated and user ID is stored in res.locals

      const user = await User.findById(userId).select("password");
      if (!user) {
        throw new CustomError(404, "User not found");
      }

      const storedPassword = user.password;

      res.status(200).json({ storedPassword });
    } catch (error) {
      next(error);
    }
  }

  static async verifyPassword(req, res, next) {
    try {
      const { inputtedPassword, storedPassword } = req.body;

      const isPasswordValid = isStringRelevant(inputtedPassword, storedPassword);

      if (!isPasswordValid) {
        return res.status(403).json({ success: false, message: "Incorrect password" });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AuthController;
