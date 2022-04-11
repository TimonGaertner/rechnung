const { app, BrowserWindow } = require("electron");
const electron = require("electron");
const fs = require("fs");
const ipc = electron.ipcMain;
app.allowRendererProcessReuse = false;
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        backgroundColor: "#fff",
    });

    win.loadFile("html/index.html");
};
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

