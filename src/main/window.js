import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { protocol, BrowserWindow } from 'electron'

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

export function createMainWindow () {
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
