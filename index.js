var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

var userCount = 0;
var isRefreshed = false;

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  if(!isRefreshed){
    io.emit('refresh',{});
    isRefreshed = true;
  }
  socket.on('chat message', function (msg, color) {
    io.emit('chat message', msg, color);
  });
});



setInterval(() => {

  if (io.engine.clientsCount !== userCount) {
    userCount = io.engine.clientsCount;
    io.emit('user count', userCount);
  }

}, 1000);



http.listen(port, function () {
  console.log('listening on *:' + port);
});
