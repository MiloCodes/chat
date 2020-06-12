const { app, BrowserWindow } = require('electron')
const DiscordRPC = require('discord-rpc');
const keys = require(__dirname + '/keys.json');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: __dirname + "/icon.png",
    webPreferences: {
      nodeIntegration: false
    },
  })

  win.loadURL('http://proyecto.club')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

const clientId = keys.discordId;

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
  if (!rpc || !win) {
    return;
  }
  if (win.title) {
    let currentUsers = win.title.substring(6, 7);
    let userUsers = currentUsers > 2 ? 'users' : 'user';
    let stateMessage = currentUsers > 1 ? `with ${currentUsers - 1} ${userUsers}` : 'alone';

    rpc.setActivity({
      details: 'Currently chatting',
      state: stateMessage,
      startTimestamp,
      largeImageKey: 'logo',
      largeImageText: 'Chatting anonymously',
      smallImageKey: 'anon',
      // smallImageText: '',
      instance: false,
    });
  }
}

rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);