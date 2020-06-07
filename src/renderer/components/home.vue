<template>
  <v-container class="fill-height mx-auto" fluid>
    <div class="mx-auto">
      <h1 class="display-4">{{process.pid}}</h1>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      process: {
        pid: process.pid,
        mem: process.memoryUsage()
      }
    };
  }
};
</script>

<style>
</style>