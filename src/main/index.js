const { app, ipcMain, Notification } = require("electron");
import { mainWindow } from "./window";
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
    this.server = null;
  }

  init() {
    this.lifecycle();
    this.ipc();
  }

  lifecycle() {
    app.on("ready", () => {
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
    this.mainWin.on("closed", () => {
      this.mainWin = null;
    });
  }

  createServer(connection) {
    const net = require("net");
    this.server = new net.Server();
    console.log(this.server.listening);
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
        
      }
    });

    this.server.on("connection", (socket) => {
      socket.id = Math.floor(Math.random() * 1000);
      var notif = new Notification({
        title: "Nouvelles connexion !",
        body: `une nouvelles connexion entrant ${socket.remoteAddress}`,
      });

      socket.read();

      notif.show();
      this.mainWin.webContents.send("newConnection", {
        id: socket.id,
        ip: socket.remoteAddress,
      });

      socket.on("close", () => {
        this.mainWin.webContents.send("slaveQuitted", socket.id);
      });

      ipcMain.on("giveme", (err, res) => {
        socket.pipe();
        socket.write(res);
      });

      socket.on("data", (data) => {
        this.mainWin.webContents.send("datarec", data.toString());
        console.log(`${data.toString("UTF-8")}`);
      });
    });

    this.server.listen({ host: connection.ip, port: connection.port }, () => {
      console.log(`Server listen in ${connection.port}`);
    });

    return this.server.listening;
  }

  closeServer() {
    if (this.server.close()) {
      console.log("Server stop listening");
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

    ipcMain.handle("serverlisten", (event, msg) => {
      this.createServer(msg);
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
