const { app, BrowserWindow } = require('electron')

function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: __dirname + "/icon.png",
    webPreferences: {
      nodeIntegration: false
    }
  })

  win.loadURL('http://proyecto.club')
}

app.whenReady().then(createWindow)