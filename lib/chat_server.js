
var createChat = function(server){
  var io = require('socket.io')(server);
  io.on('connection', function(socket){
    socket.emit('message', { text: "message has been sent" } )
    socket.on('message', function(message) {
      io.emit('addEvent', {newComment: message.text} )
    })
  });
};


exports.createChat = createChat;
