const { ObjectId } = require("mongodb");

module.exports = class Home {
  constructor(houseName, price, location, rating, url, description = null) {
    this.houseName = houseName;
    this.housePrice = price;
    this.houseLocation = location;
    this.houseRating = rating;
    this.photo = url;
    this.houseDescription = description;
  }

  save() {
    const db = getDB();
    return db.collection("homes").insertOne(this);
  }

  static async fetchAll() {
    const db = getDB();
    return db.collection("homes").find().toArray();
  }

  static async findById(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .find({ _id: new ObjectId(String(homeId)) })
      .next();
  }

  static EditHome(homeId, newHome) {
    const db = getDB();
    return db
      .collection("homes")
      .updateOne({ _id: new ObjectId(String(homeId)) }, { $set: newHome });
  }

  static DeleteHome(homeId) {
    const db = getDB();
    return db
      .collection("homes")
      .deleteOne({ _id: new ObjectId(String(homeId)) });
  }
};
