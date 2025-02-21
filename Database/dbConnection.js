const mongoose = require("mongoose");

function mongoConection() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Mongo is running too ..");
    })
    .catch((err) => {
      console.log("DataBase error", err);
    });
}

module.exports = mongoConection;
