const mongose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const DB_link = process.env.link;

const connection = async () => {
  try {
    await mongose.connect(DB_link);
    console.log("db-connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connection;
