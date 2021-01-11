const path = require("path");
const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

//Putting in sample data for rooms, to display
//on client side
const rooms = {
  coders4life: {},
  siliconValley: {},
};

const usernames = [];

app.post("/lobby", (req, res) => {
  if (usernames.includes(req.body.username)) {
    res.redirect("/");
  } else {
    usernames.push(req.body.username);
    res.render("lobby", { rooms });
  }
});

app.get("/", (req, res) => {
  res.render("enter");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
