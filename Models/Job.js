const mongoose = require("mongoose");

const job = mongoose.Schema(
  {
    title: { type: String },
    company: { type: String },
    description: { type: String },
    isImage: { type: Boolean, default: false },
    ImageUrl: { type: String },
    postedby: {
      id: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", job);

module.exports = Job;
