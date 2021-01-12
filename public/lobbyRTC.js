const socket = io();

const lobbyMessages = document.getElementsByClassName("lobby-messages")[0];

socket.emit("user-joined-lobby", username);

socket.on("user-joined-lobby", (data) => {
  const message = document.createElement("p");
  message.innerHTML = `User ${data} has connected`;
  lobbyMessages.appendChild(message);
});

socket.on("user-left-lobby", (data) => {
  console.log("User left");
  const message = document.createElement("p");
  message.innerHTML = `User ${data} has disconnected`;
  lobbyMessages.appendChild(message);
});
