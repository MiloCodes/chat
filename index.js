/* eslint-disable no-console */
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 80;

let userCount = 0;
let isRefreshed = false;

const links = [
  {
    command: '!attendance',
    link: '<a target="_blank" href="http://attendance.pscs.org">Attendance System</a>',
  },
  {
    command: '!manifesto',
    link: '<a target="_blank" href="https://docs.google.com/document/d/1sAaruzhYcoHRRGTIGUbJcbn1MFx_zi3x4Urf1En2Ty4">Manifesto</a>',
  },
  {
    command: '!pscsclicker',
    link: '<a target="_blank" href="https://coderlads.github.io/pscsclicker/">PSCS Clicker</a>',
  },
  {
    command: '!proyecto',
    link: '<a href="https://www.dropbox.com/s/pmsa9eu4rzunvd2/proyecto_especial.zip?dl=1">Proyecto</a>',
  },
];

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg, color) => {
    let finalMsg = msg;
    if (msg === '!help') {
      links.forEach((item) => {
        finalMsg += `, ${item.command}`;
      });
    }
    links.forEach((item) => {
      if (item.command === msg) {
        finalMsg = item.link;
      }
    });

    io.emit('chat message', finalMsg, color);
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

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
