const mongoose = require("mongoose");

const chat = mongoose.Schema(
  {
    Name: { type: String, trim: true },
    Groupchat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastmessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chat);

module.exports = Chat;
