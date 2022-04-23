const express = require("express");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { Secure } = require("../Middleware/Secure");
const Center = require("../Models/Center");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send("plz enter all fileds");
    return;
  }

  const isuser = await User.findOne({ email });
  //const iscenter = await Center.findOne({ email });
  if (isuser) {
    res.status(400).send("user already exist");
    return;
  }
  const user = await User.create({ name, email, password });

  if (user) {
    const payload = user._id;
    const token = await jwt.sign({ payload }, process.env.key, {
      expiresIn: "1d",
    });
    console.log(token);
    res.status(201).send(user);
  } else {
    res.status(400).send("fail to create the user");
    return;
  }
});
router.post("/addcenter", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("plz enter all fileds");
    return;
  }

  const isuser = await Center.findOne({ email });
  if (isuser) {
    res.status(400).send("user already exist");
    return;
  }
  const user = await Center.create({ email, password });

  if (user) {
    res.status(201).send(user);
  } else {
    res.status(400).send("fail to create the user");
    return;
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const center = await Center.findOne({ email });

  if (user && user.password === password) {
    const payload = user._id;
    const token = await jwt.sign({ payload }, process.env.key);
    // console.log(token);
    const data = {
      _id: `${user._id}`,
      Name: `${user.name}`,
      Email: `${user.email}`,
      token: token,
    };
    //sessionStorage.setItem("h", JSON.stringify(data));
    res.status(201).send(data);
    return;
  } else if (center && center.password === password) {
    const data = {
      Email: `${center.email}`,
      center: true,
    };
    //sessionStorage.setItem("h", JSON.stringify(data));
    res.status(201).send(data);
    return;
  }
  {
    res.status(401).send("Invalid credentials");
    return;
  }
});

router.get("/SearchUser", Secure, async (req, res) => {
  const tags = req.query.search
    ? {
        // $or: [
        name: { $regex: req.query.search, $options: "i" },
        // { email: { $regex: req.query.search, $options: "i" } },
        // ],
      }
    : {};
  console.log(tags);
  const users = await User.find(tags).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
module.exports = router;
