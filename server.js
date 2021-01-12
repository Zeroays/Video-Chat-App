const path = require("path");
const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");

const PORT = 3000;

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = require("socket.io")(server);

//Format of rooms object -> subject to change

// rooms ->
//      id     ->
//                  roomName
//                  users
//                  type -> public/private
// uuidv4(): { name: coders4life , users: {}, type: "public" },
//   uuidv4(): { name: siliconValley, users: {}, type: "private" },

const lobby = { id: uuidv4(), users: {} };
const rooms = {};

const getListOfUsers = (usersObj) => {
  return Object.values(usersObj);
};

const validUsername = (users, name) => {
  return !userNameExists(users, name) && !isNameEmpty(name);
};

const isNameEmpty = (name) => {
  return name === "";
};

const userNameExists = (users, name) => {
  return users.includes(name);
};

const roomExists = (rooms, roomName) => {
  return roomName in rooms;
};

app.get("/", (req, res) => {
  res.render("enter");
});

app.get("/:room", (req, res) => {
  if (!roomExists(rooms, req.params.room)) return res.redirect("/");
  res.render("room", {
    roomName: rooms[req.params.room].name,
    roomId: req.params.room,
  });
});

app.post("/lobby", (req, res) => {
  const usersInLobby = lobby.users;
  if (!validUsername(getListOfUsers(usersInLobby), req.body.username))
    return res.redirect("/");
  res.render("lobby", { rooms, username: req.body.username });
});

app.post("/room", (req, res) => {
  if (roomExists(rooms, req.body.room)) return res.redirect("/");
  const roomId = uuidv4();
  rooms[roomId] = { name: req.body.room, users: {}, type: req.body.roomType };
  res.redirect(roomId);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//SOCKET IO

io.on("connection", (socket) => {
  socket.on("new-user", (roomId) => {});

  socket.on("send-chat-message", (roomId, message) => {});
  socket.on("user-joined-lobby", (username) => {
    lobby.users[socket.id] = username;
    socket.join(lobby.id);
    socket
      .to(lobby.id)
      .broadcast.emit("user-joined-lobby", lobby.users[socket.id]);
  });
  socket.on("disconnect", () => {
    socket
      .to(lobby.id)
      .broadcast.emit("user-left-lobby", lobby.users[socket.id]);
    delete lobby.users[socket.id];
  });
});
