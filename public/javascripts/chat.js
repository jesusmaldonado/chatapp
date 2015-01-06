(function(){

  if (typeof Chatroom === "undefined") {
    window.Chatroom = {};
  }

  Chatroom.chatbox = function (socket) {
    this.socket = socket;
  };

  Chatroom.chatbox.prototype.sendMessage = function(messageText){
    this.socket.emit('message', {text: messageText});
  }

}());
