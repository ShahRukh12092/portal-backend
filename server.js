const express = require("express");
const mongose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");

const Connection = require("./DB/Connection");

const app = express();

app.use(express.json());

app.use(cors());

Connection();

dotenv.config();
const port = process.env.port || 30001;

app.use(require("./API/User"));
app.use(require("./API/Chat"));
app.use(require("./API/Message"));
app.use(require("./API/Startup"));
const connection = app.listen(port, () => {
  console.log("sever running");
});

const io = require("socket.io")(connection, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connect", (socket) => {
  console.log("connected");

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("Connected");
  });

  socket.on("con", (Chats) => {
    socket.join(Chats);
    console.log("user joined the chat " + Chats);
  });

  socket.on("send", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit("RecieveMessage", newMessage);
    });
  });
});
