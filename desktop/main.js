
const { app, BrowserWindow } = require('electron');

const URL = process.env.WEB_BASE_URL || 'http://localhost:3000';

function createWindow () {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: { contextIsolation: true }
  });
  win.loadURL(URL);
}

app.whenReady().then(()=>{
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
