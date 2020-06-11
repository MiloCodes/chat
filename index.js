var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

var userCount = 0;
var isRefreshed = false;

var links = [
  {
    command: '!attendance',
    link: '<a target="_blank" href="attendance.pscs.org">Attendance System</a>',
  },
  {
    command: '!manifesto',
    link: '<a target="_blank" href="https://docs.google.com/document/d/1sAaruzhYcoHRRGTIGUbJcbn1MFx_zi3x4Urf1En2Ty4">Manifesto</a>',
  },
  {
    command: '!pscsclicker',
    link: '<a target="_blank" href="https://coderlads.github.io/pscsclicker/">PSCS Clicker</a>',
  }
];

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('chat message', function (msg, color) {
    links.forEach(item => {
      if(item.command === msg){
        msg = item.link;
      }
    });

    io.emit('chat message', msg, color);
  });
});



setInterval(() => {

  if (io.engine.clientsCount !== userCount) {
    userCount = io.engine.clientsCount;
    io.emit('user count', userCount);
    if (!isRefreshed) {
      io.emit('refresh', {});
      isRefreshed = true;
    }
  }

}, 1000);



http.listen(port, function () {
  console.log('listening on *:' + port);
});
