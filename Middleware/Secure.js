const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const Secure = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log(req.headers.authorization);

      //  console.log(token);

      const DecodeToken = jwt.verify(token, process.env.key);
      // console.log("1", DecodeToken);

      req.user = await User.findById(DecodeToken.payload);
      //console.log(req.user);

      next();
    } catch (error) {
      res.status(401).send(" hnot allowed");
    }
  }
  if (!token) {
    res.status(401).send(" not allowed");
  }
};

module.exports = { Secure };
