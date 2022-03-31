const { app, BrowserWindow } = require("electron");
const electron = require("electron");
const fs = require("fs");
const ipc = electron.ipcMain;
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile("html/index.html");
};

app.whenReady().then(() => {
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

