const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/MongoConnect");

class User {
  constructor({ _id, username, lastName, email, password, displayName, role, profilePicUrl, major, yearOfEntry}) {
    Object.assign(this, { _id, username,lastName, email, password, displayName, role, profilePicUrl, major, yearOfEntry});
  }

  static async collection() {
    return getDatabase().collection("Users");
  }
  

  static async findAll(query) {
    const collection = await User.collection();
    const data = await collection.find(query).toArray();
    return data.map((el) => new User(el));
  }

  static async findOne(query) {
    const collection = await User.collection();
    const myData = await collection.findOne(query);
    return myData;
  }

  static async create({ username, lastName, email, password, displayName = "User", role = "citizen", profilePicUrl = "", major="", yearOfEntry="" }) {
    const collection = await User.collection();
    const result = await collection.insertOne({ username, lastName, email, password, displayName, role, profilePicUrl, major, yearOfEntry});
    return result;
  }

  static async deleteById(_id) {
    const collection = await User.collection();
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    return result;
  }

  static async updateById(_id, updateDoc) {
    const collection = await User.collection();
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, updateDoc);
    return result;
  }
}

module.exports = User;
