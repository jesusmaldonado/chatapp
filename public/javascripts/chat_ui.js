$(function() {
  var socket = io();
  var chatroom = new Chatroom.chatbox(socket);

  socket.on('addEvent', function(serverResponse) {
    var date = new Date()
    var li = $("<li>").text(serverResponse.username + " says " +
        serverResponse.newComment +
        " @ " +
        date.toDateString() +
        " " + date.getHours() +
        " hours " + date.getMinutes()+
        " minutes")

    $(".display_messages").prepend(li)
  });

  socket.on("initialConnect", function(welcomeData){
    var date = new Date()

    chatroom.username = welcomeData.username

    var $h1 = $("<h1>").text(welcomeData.welcomemsg +
        "  " +
        date.toDateString() +
        " " + date.getHours() +
        " hours " + date.getMinutes() +
        " minutes as " + chatroom.username).addClass("banner");

    $(".welcome").append($h1)
  })

  socket.on("nicknameChangeResult", function(resultData) {
    var date = new Date()

    if (resultData.success) {
      chatroom.username = resultData.username;
      var $h1 = $("<h1>").text("changed USERNAME to  " + chatroom.username + date.toDateString() + " " + date.getHours() + " hours " + date.getMinutes() + " minutes as " + chatroom.username);
      $(".welcome").find(".banner").html($h1);
    } else {
      var failMsg = resultData.message
      var $h2 = $("<h2>").text(resultData.message +
          "  " +
          date.toDateString() +
          " " + date.getHours() +
          " hours " + date.getMinutes() +
          " minutes" );

      $(".welcome").append($h2);
    }
  })

  socket.on('userChange', function(changeData){

    if (changeData.disconnect) {
      $(".display_messages").prepend($("<li>").text(changeData.user
        + " has left"))
    } else {
  $(".display_messages").prepend($("<li>").text(changeData.user
    + " has joined"))
    }
  })


  socket.on("updateUsers", function(userData){
    $(".userList").empty();
    var usr_array = userData.userList;

    usr_array.forEach(function(username) {
      $(".userList").append($("<li>").text(username))
    })
  })


  $(".newInput").on("submit", function(event){
    event.preventDefault();
    var message = $(event.currentTarget).find("#message").val()
    var match = message.match(/\/nick (.*)/)
    if (match) {
      chatroom.makeUser(match[1])
    } else {
      chatroom.sendMessage(message);
    }
  });
});
