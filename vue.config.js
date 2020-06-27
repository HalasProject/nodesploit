process.env.VUE_APP_VERSION = require('./package.json').version
const path = require('path')

module.exports = {
  configureWebpack: {
    entry: './src/renderer/main.js',
    resolve: {
      alias: {
        '@R': path.resolve(__dirname, 'src/renderer/'),
        '@M': path.resolve(__dirname, 'src/main/')
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      chainWebpackMainProcess: (config) => {
        // Chain webpack config for electron main process only
      },
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: path.resolve(__dirname, 'src/main/main.js')
    }
  }
}
