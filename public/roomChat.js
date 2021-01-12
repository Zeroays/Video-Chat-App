const socket = io();
const chat = document.getElementsByClassName("message-container")[0];
const chatInput = document.getElementsByClassName("chat-input")[0];

socket.emit("new-user", roomId);

socket.on("chat-message", (data) => {
  const message = chatInput.value;
  socket.emit("send-chat-message", roomId, message);
  chatInput.value = "";
});
