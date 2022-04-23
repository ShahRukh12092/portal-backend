const express = require("express");
const User = require("../Models/User");
const { Secure } = require("../Middleware/Secure");
const Chat = require("../Models/Chat");

const router = express.Router();

router.post("/chat", Secure, async (req, res) => {
  const { Userid } = req.body;
  console.log("hello");
  if (!Userid) {
    res.status(400).send(" No usr send for chat");
    return;
  }
  try {
    var ischat = await Chat.find({
      Groupchat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: Userid } } },
      ],
    })
      .populate("users", "-password")
      .populate("lastmessage");
    ischat = await User.populate(ischat, {
      path: "lastmessage.sender",
      select: "name email",
    });
    if (ischat.length > 0) {
      res.status(200).send(ischat[0]);
    } else {
      const chat = {
        Name: "hey",
        Groupchat: false,
        users: [req.user._id, Userid],
      };
      const newchat = await Chat.create(chat);

      const populateChat = await Chat.findOne({ _id: newchat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(populateChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/getchats", Secure, async (req, res) => {
  //console.log("get chats");
  try {
    var chat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("lastmessage")
      .sort({ updateAt: -1 });
    chat = await User.populate(chat, {
      path: "lastmessage.sender",
      select: "name email",
    });
    res.status(200).send(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/creategroup", Secure, async (req, res) => {
  try {
    const users = JSON.parse(req.body.users);
    const name = req.body.name;

    if (!users || !name) {
      return res.status(400).send({ error: " please enter the data" });
    }

    users.push(req.user);

    const Groupchat = await Chat.create({
      Name: name,
      Groupchat: true,
      users,
    });

    const newChat = await Chat.findOne({ _id: Groupchat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(newChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/adduser", Secure, async (req, res) => {
  try {
    const groupID = "623c7e912d3ec0721e879bb8";
    const user = req.body.user;

    const update = await Chat.findByIdAndUpdate(
      groupID,
      {
        $push: { users: user },
      },
      { new: true }
    ).populate("users", "-password");

    if (!update) {
      return res.status(404).send({ message: "chat not found" });
    } else {
      res.status(200).send(update);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;
