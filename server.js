const path = require("path");
const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

//Format of rooms object -> subject to change

// rooms ->
//      roomName ->
//                  users
//                  type -> public/private
const rooms = {
  coders4life: { users: {}, type: "public" },
  siliconValley: { users: {}, type: "private" },
};

const usernames = [];

const validUsername = (usernames, name) => {
  return !userNameExists(usernames, name) && !isNameEmpty(name);
};

const isNameEmpty = (name) => {
  return name === "";
};

const userNameExists = (usernames, name) => {
  return usernames.includes(name);
};

const roomExists = (rooms, roomName) => {
  return roomName in rooms;
};

app.get("/", (req, res) => {
  res.render("enter");
});

app.get("/:room", (req, res) => {
  if (!roomExists(rooms, req.params.room)) return res.redirect("/");
  res.render("room", { roomName: req.params.room });
});

app.post("/lobby", (req, res) => {
  console.log(req.body.username);
  if (!validUsername(usernames, req.body.username)) return res.redirect("/");
  usernames.push(req.body.username);
  res.render("lobby", { rooms });
});

app.post("/room", (req, res) => {
  if (roomExists(rooms, req.body.room)) return res.redirect("/");
  rooms[req.body.room] = { users: {}, type: req.body.roomType };
  res.redirect(req.body.room);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
