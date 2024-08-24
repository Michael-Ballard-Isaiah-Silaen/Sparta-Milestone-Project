const { CustomError } = require("../middlewares/Errorhandler");
const User = require("../models/User");

class ProfileController {
  static async getByusername(req, res, next) {
    try {
      const { username } = req.params;

      const user = await User.findOne({ username });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateById(req, res, next) {
    try {
      const { _id } = req.params;
      const {username,lastName, email, profilePicUrl, displayName, major, yearOfEntry } = req.body;
      const { _id: UserId } = res.locals.user;

      if (_id !== UserId) {
        throw new CustomError(403, "Unauthorized");
      }

      await User.updateById(_id, { $set: {username, lastName, email, profilePicUrl, displayName, major, yearOfEntry } });

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ProfileController;
