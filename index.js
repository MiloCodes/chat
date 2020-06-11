var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg,color){
    io.emit('chat message', msg,color);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
