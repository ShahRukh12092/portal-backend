const mongoose = require("mongoose");
const User = require("./User");

const startup = mongoose.Schema(
  {
    name: { type: String },
    logo: { type: String },
    abstract: { type: String },
    Alumni: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    starting_year: { type: String },
    links: {
      website: { type: String },
      facebook: { type: String },
      youtube: { type: String },
    },
    pics: {
      pic1: { type: String },
      pic2: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Startup = mongoose.model("Startup", startup);

module.exports = Startup;
