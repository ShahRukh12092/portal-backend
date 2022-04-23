const express = require("express");
const User = require("../Models/User");
const { Secure } = require("../Middleware/Secure");
const Chat = require("../Models/Chat");
const Message = require("../Models/Message");
const Job = require("../Models/Job");

const router = express.Router();

router.post("/sendMessage", Secure, async (req, res) => {
  try {
    const { data, ChatId } = req.body;
    console.log(req.body);
    if (!data || !ChatId) {
      return res.status(400).send(" Enter the data ");
    }
    var message = {
      sender: req.user._id,
      data: data,
      chat: ChatId,
    };

    var newMessage = await Message.create(message);
    console.log(newMessage);
    newMessage = await newMessage.populate("sender", "name");
    newMessage = await newMessage.populate("chat");
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.ChatId, { lastmessage: newMessage });
    res.send(newMessage);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/getChat/:chatId", Secure, async (req, res) => {
  const id = req.params.chatId;
  //console.log(id);
  try {
    const message = await Message.find({ chat: id })
      .populate("sender", "name email")
      .populate("chat");
    res.send(message);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/Jobs/postjob", async (req, res) => {
  try {
    const { title, company, description, posted_by } = req.body;

    if (!title || !company || !description || !posted_by) {
      return res.status(400).json({ error: "plz enter all fileds :(" });
    }
    const newjob = new Postjob({ title, company, description, posted_by });

    const j = await newjob.save();
    res.status(200).json(j);
  } catch (error) {
    res.json(error);
    console.log(error);
  }

  router.get("/getjobs", async (res, req) => {
    try {
      jobs = await Job.find();
      if (!jobs) {
        return res.status(400).json({ error: "no job here yet" });
      } else {
        req.json(jobs);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
