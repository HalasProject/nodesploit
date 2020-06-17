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

      <v-list-item link to="/server">
        <v-list-item-action>
          <v-icon>mdi-lan-connect</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="`Server | ${$store.getters.is_open ? 'Online' : 'Offline'}`"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/payload">
        <v-list-item-action>
          <v-icon>mdi-skull-crossbones</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Payload</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/settings">
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
        <v-list-item v-for="victime in victimes" :key="`${victime.id ? victime.id : ''}`" link>
          <v-list-item-action>
            <v-icon>mdi-account-cowboy-hat</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            <router-link class="text--black" :to="`victime/${victime.id}`">
              <div class="float-left">{{victime.ip}}</div>
            </router-link>

            <div @click="deleteme(victime.id)" class="float-right">
              <v-icon>mdi-delete</v-icon>
            </div>
          </v-list-item-title>
        </v-list-item>
      </template>
      <v-container v-show="victimes.length == 0">
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
  methods: {
    deleteme(victime_id) {
      ipcRenderer.send('delete_victime',victime_id)
    }
  },
};
</script>

<style>
</style>