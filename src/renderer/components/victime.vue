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
    <v-container>
      <v-tabs-items v-model="tab">
        <v-tab-item :key="3" :value="'tab-3'">
          <v-card flat>
            <v-text-field v-model="inputs" @keyup.enter="cmd"></v-text-field>
            <code id="terminal" v-html="cli" class="py-4 px-4" style="width: 100%;"></code>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  data: () => ({
    tab: null,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    socket_id: "",
    inputs: "",
    cli: "Test "
  }),
  methods: {
    cmd() {
      this.cli = "";
      ipcRenderer.send("cmd", this.inputs);
    }
  },
  created() {
    ipcRenderer.on("datarec", (event, res) => {
      this.cli += res;
    });
    this.socket_id = this.$router.currentRoute.params.id;
  }
};
</script>

<style>
#terminal {
  background-color: #000;
  border: 1px solid #000;
  color: #00ff00;
  padding: 8px;
  font-family: courier new;
}
</style>