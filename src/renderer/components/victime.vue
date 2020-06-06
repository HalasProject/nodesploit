<template>
  <div>
    <v-text-field v-model="inputs" label="command"></v-text-field>
    <p v-text="output"></p>
    <button @click="givegive()">send</button>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  data: () => ({
    socket_id: "",
    inputs: "",
    output: "Test "
  }),
  methods:{
      givegive(){
          ipcRenderer.send("giveme",this.inputs)
      }
  },
  created() {
    ipcRenderer.on('datarec',(event,res)=>{
        this.output = res
    })
    this.socket_id = this.$router.currentRoute.params.id;
  }
};
</script>

<style>
</style>