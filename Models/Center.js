const mongoose = require("mongoose");

const center = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Center = mongoose.model("Center", center);
module.exports = Center;
