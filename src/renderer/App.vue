<template>
  <v-app id="inspire">
    <sidebar :drawer="openside"></sidebar>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="openside = !openside"></v-app-bar-nav-icon>
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

    <v-content class="mx-auto">
      <v-container class="fill-height" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; MIT - SALAH BENTAYEB</span>
    </v-footer>
  </v-app>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import sidebar from "@/components/sidebar";
export default {
  name: "nodesploit",
  components: {
    sidebar
  },
  props: {
    source: String
  },
  methods: {
    closeapp: () => {
      ipcRenderer.send("close-app");
    },
    minimizeApp: () => {
      ipcRenderer.send("minimize-app");
    },
    maximizeApp: () => {
      ipcRenderer.send("maximize-app");
    }
  },
  data: () => ({
    openside: null
  }),
  created() {
    console.log('created')
    if (this.$store.getters.is_open) {
      ipcRenderer.invoke("serverlisten", {
        port: this.$store.getters.port,
        ip: this.$store.getters.ip
      });
    } else {
      ipcRenderer.on("listened", (event, port) => {
        this.$store.dispatch("LISTENED", port);
      });
    }
  },
  mounted() {
    ipcRenderer.on("closeConnection", (event, socket) => {
      this.$vs.notification({
        title: "Connection closed",
        text: `These documents refer to the latest version of vuesax (4.0+),
            to see the documents of the previous versions you can do it here 👉 Vuesax3.x`
      });
    });
  }
};
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
