
var createChat = function(server){
  var io = require('socket.io')(server);

  var guestNumber = 1;

  var nicknames = {};

  io.on('connection', function(socket){
    guestNumber += 1;
    nicknames[socket.id] = "guest" + guestNumber

    var user_list = function (nicknames) {
      user_array = []
      for (var key in nicknames) {
        user_array.push(nicknames[key]);
      }
      return user_array;
    }

    var update_users = function () {
      io.emit('updateUsers', {
        userList: user_list(nicknames)
      })
    }

    var notify_user_count = function (disconnect, username) {
      io.emit('userChange', {
        disconnect: disconnect,
        user: username
      })
    };

    update_users();

    notify_user_count(false, nicknames[socket.id])

    socket.emit('initialConnect', {
      welcomemsg: "Initial Connect",
      username: nicknames[socket.id]
    });

    socket.on('disconnect', function(){
      notify_user_count(true, nicknames[socket.id]);
      delete nicknames[socket.id];
      update_users();
    });


    socket.on('message', function(message) {
      io.emit('addEvent', {
        newComment: message.text,
        username: nicknames[socket.id]
      })
    });


    socket.on("nicknameChangeRequest", function(nicknameData) {
      if ( nicknameData.nickname.match(/guest[123456789]/) ) {

        socket.emit("nicknameChangeResult", {success: false, message: "Names cannot begin with guest and a number"})
      } else {
        nicknames[socket.id] = nicknameData.nickname;
        update_users();
        socket.emit("nicknameChangeResult", { success: true, username: nicknames[socket.id]})

      }
    });

  });
}


exports.createChat = createChat;
