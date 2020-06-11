<template>
  <div>
    <v-tabs v-model="tab" centered icons-and-text>
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Information
        <v-icon>mdi-information-outline</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Process
        <v-icon>mdi-apps</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        CLI
        <v-icon>mdi-powershell</v-icon>
      </v-tab>
      <v-tab href="#tab-4">
        WebCam
        <v-icon>mdi-webcam</v-icon>
      </v-tab>
      <v-tab href="#tab-5">
        Screen
        <v-icon>mdi-monitor-screenshot</v-icon>
      </v-tab>
    </v-tabs>
   
      <v-tabs-items v-model="tab">
        <v-tab-item :key="3" :value="'tab-3'" id="tab-3">
          <v-card flat>
            <nsterminal :socket="{id:this.socket_id}" :shell_output="output" @terminal_cmd="cmd"></nsterminal>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
   
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import terminal from "./terminal";
export default {
  components: {
    nsterminal: terminal
  },
  data: () => ({
    tab: null,
    socket_id: "",
    inputs: "",
    output: ""
  }),
  methods: {
    cmd(value) {
      ipcRenderer.send("cmd", value);
    }
  },
  created() {
    ipcRenderer.on("datarec", (event, res) => {
      this.output =  res ;
    });
    this.socket_id = this.$router.currentRoute.params.id;
  }
};
</script>

 <style>

</style>