const mongoose = require("mongoose");

exports.connect = async () => {
  await mongoose
    .connect(process.env.dbUrl)
    .then(() => {
      console.log("DB connection established");
    })
    .catch((error) => {
      console.log("Failed to connect", error);
    });
};
