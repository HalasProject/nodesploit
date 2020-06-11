<template>
  <v-container class="mx-auto" fluid>
    <div class="mx-auto pt-10">
      <h1 class="display-4 font-weight-black">HELLO WORLD</h1>
      <v-row>
        <v-col md="4" sm="12" xs="12">
          <v-card>
            <v-card-title>Node Info</v-card-title>
            <v-card-subtitle>Information about node versions</v-card-subtitle>
            <v-card-text>
              <ul>
                <li v-for="(proc,key,index) in process.versions" :key="index">
                  <b>{{key}}</b>
                  : {{proc}}
                </li>
                <!-- <li>
                  <b>PID:</b>
                  {{process.pid}}
                </li>
                <li>
                  <b>Archetecture:</b>
                  {{process.arch}}
                </li>
                <li>
                  <b>Platform:</b>
                  {{platforme}}
                </li>-->
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="8" sm="12" xs="12">
          <v-card>
            <v-card-title>About NodeSploit</v-card-title>
            <v-card-subtitle>Please readme before starting</v-card-subtitle>
            <v-card-text>This Software provides information that could be used to assess the security of a machine, website, network. Do not use what you learn here to test (or worse, attack) without the permission of the target.</v-card-text>
          </v-card>
          <v-divider></v-divider>
          <v-card class="mt-10">
            <v-card-title>Server Information</v-card-title>
            <v-card-subtitle>Please readme before starting</v-card-subtitle>
            <v-row class="mx-auto text-center">
              <v-col md="3">
                <p>Platform</p>
                <v-icon :x-large="true">{{platforme}}</v-icon>
              </v-col>
              <v-col md="3">
                <p>Architecture</p>
                <v-icon :x-large="true">{{arch}}</v-icon>
              </v-col>
              <v-col md="3">
                <p>Totale Victime</p>
                <p class="display-1">{{$store.getters.childs.length}}</p>
              </v-col>
              <v-col md="3">
                <p>Listen</p>
                <v-icon :x-large="true" v-if="$store.getters.is_open">mdi-power-plug</v-icon>
                <v-icon :x-large="true" v-else>mdi-power-plug-off</v-icon>
              </v-col>
            </v-row>
            <v-card-text>This Software provides information that could be used to assess the security of a machine, website, network. Do not use what you learn here to test (or worse, attack) without the permission of the target.</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      process: process
    };
  },
  mounted() {
    console.log(process);
  },
  computed: {
    platforme() {
      switch (process.platform) {
        case "win32":
          return "mdi-microsoft-windows";
          break;

        case "darwin":
          return "mdi-apple";
          break;

        default:
          return "mdi-linux";
          break;
      }
    },arch(){
      switch (process.arch) {
        case 'x64':
          return 'mdi-cpu-64-bit'
          break;
      
        default:
          return 'mdi-cpu-32-bit'
          break;
      }
    }
  }
};
</script>

<style>
</style>