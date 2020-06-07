<template>
  <div>
    <v-list>
      <v-list-item link to="/">
        <v-list-item-action>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="server">
        <v-list-item-action>
          <v-icon>mdi-lan-connect</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="`Server | ${$store.getters.is_open ? 'Online' : 'Offline'}`"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="payload">
        <v-list-item-action>
          <v-icon>mdi-skull-crossbones</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Payload</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link>
        <v-list-item-action>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list>
      <v-subheader class="mt-4 grey--text text--darken-1">VICTIME</v-subheader>
      <template v-if="victimes != 'undefined'">
        <v-list-item
          v-for="victime in victimes"
          :key="`${victime.id ? victime.id : ''}`"
          link
          :to="`victime/${victime.id}`"
        >
          <v-list-item-action>
            <v-icon>mdi-account-cowboy-hat</v-icon>
          </v-list-item-action>
          <v-list-item-title v-text="victime.ip"></v-list-item-title>
        </v-list-item>
      </template>
      <v-container v-else>
        <div class="font-weight-light mt-4 text-center">EMPTY LIST</div>
      </v-container>
    </v-list>
  </div>
</template>


<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      victimes: this.$store.getters.childs
    };
  },
  computed: {},
  mounted() {
    ipcRenderer.on("newConnection", (event, socket) => {
      this.$store.dispatch("ADD_CHILD", { id: socket.id, ip: socket.ip });
    });
    ipcRenderer.on("slaveQuitted", (event, id) => {
      console.log("enfant partie");
      this.$store.dispatch("REMOVE_CHILD", id);
    });
  }
};
</script>

<style>
</style>