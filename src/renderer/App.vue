<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <sidebar></sidebar>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <img width="35px" height="35px" src="@/assets/nodesploit.png"/> -->

      <v-icon :color="$store.getters.is_open ? 'green darken-2' : ''">mdi-nodejs</v-icon>
      <v-toolbar-title class="ml-1">NodeSploit</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-switch
        hide-details
        inset
        label
        default
        :persistent-hint="true"
        v-model="$vuetify.theme.dark"
      ></v-switch>
      <v-btn icon @click="minimizeApp()">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>

      <v-btn icon @click="maximizeApp()">
        <v-icon>mdi-overscan</v-icon>
      </v-btn>

      <v-btn icon id="appbar">
        <v-icon>mdi-drag-variant</v-icon>
      </v-btn>

      <v-btn icon @click="closeapp()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
        <router-view></router-view>
    </v-main>

    <v-footer app>
      <span>&copy; MIT - SALAH BENTAYEB</span>
    </v-footer>
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
import sidebar from '@R/components/sidebar'
export default {
  name: 'nodesploit',
  components: {
    sidebar
  },
  data: () => ({
    drawer: null,
    count: 0
  }),
  created () {
    console.log('mounted')
    window.addEventListener('close', () => {
      if (this.$store.getters.is_open) {
        if (this.$store.getters.startup === false) {
          this.$store.dispatch('STOPLISTEN')
        }
      }
    })

    if (this.$store.getters.startup && this.$store.getters.is_open) {
      ipcRenderer.invoke('serverlisten', {
        ip: this.$store.getters.ip,
        port: this.$store.getters.port
      })
    }
  },
  mounted () {
    ipcRenderer.on('listened', (event, port) => {
      this.$store.dispatch('LISTENED', port)
    })
  },
  beforeDestroy () {},
  methods: {
    closeapp: () => {
      ipcRenderer.send('close-app')
    },
    minimizeApp: () => {
      ipcRenderer.send('minimize-app')
    },
    maximizeApp: () => {
      ipcRenderer.send('maximize-app')
    }
  }
}
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}

#appbar {
  -webkit-app-region: drag;
  cursor: pointer;
}
</style>
