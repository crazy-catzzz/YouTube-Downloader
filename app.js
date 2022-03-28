const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const ytdl = require('ytdl-core');
const { createWriteStream } = require('fs');
const path = require('path');

let win;
const createWindow = () => { // createWindow(): Crea la finestra dell'app caricando un file html (./index.html)
    if (process.platform === 'darwin') {
        win = new BrowserWindow({
            width: 900,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js') // Carica lo script di preload
            },
            titleBarStyle: "hidden",
        });
    } else if (process.platform === 'win32') {
        win = new BrowserWindow({
            width: 900,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js') // Carica lo script di preload
            },
            titleBarStyle: "hidden",
            titleBarOverlay: {
                color: '#00000000',
                symbolColor: '#a5a57f'
            }
        });
    } else {
        win = new BrowserWindow({
            width: 900,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js') // Carica lo script di preload
            }
        });
    }

    win.loadFile("index.html");
    //win.webContents.openDevTools();
}

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light';
    } else {
        nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
})

ipcMain.on('form-submission', async (event, url) => { // Quando l'app riceve il form:
    console.log(`URL: ${url}`); // Logga l'URL

    const videoInfo = await ytdl.getInfo(url);
    const video = {
        title: videoInfo.videoDetails.title,
        videoUrl: videoInfo.videoDetails.video_url
    };
    
    ytdl(url).pipe(createWriteStream(`dl/${video.title}.mp4`)); // Scarica il video

    //alert(`Done! You'll find your downloaded video at ${path.join(__dirname, 'dl', `${video.title}.mp4`)}`);
})

app.whenReady().then(() => { // Quando l'app è pronta:
   createWindow(); // Crea una finestra

   app.on('activate', () => { // Quando l'app viene aperta:
       if (BrowserWindow.getAllWindows().length === 0) createWindow(); // Se non ci sono finestre, creane una
   })
})

app.on('window-all-closed', () => { // Quando tutte le finestre vengono chiuse:
    if (process.platform !== 'darwin') app.quit(); // Se l'utente non è su OS X, chiudi l'app
})