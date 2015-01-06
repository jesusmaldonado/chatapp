$(function() {
  var socket = io();
  var chatroom = new Chatroom.chatbox(socket);

  socket.on('addEvent', function(serverResponse) {
    var date = new Date()
    var li = $("<li>").text(serverResponse.newComment +
        "  " +
        date.toDateString())

    $(".display_messages").prepend(li)
  });



  $(".newInput").on("submit", function(event){
    event.preventDefault();
    var message = $(event.currentTarget).find("#message").val()
    chatroom.sendMessage(message);
  });
});
