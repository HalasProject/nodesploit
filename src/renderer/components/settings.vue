<template>
  <v-container class="fill-height mx-auto" fluid>
    <div class="mx-auto">
      <h1 class="display-4 font-weight-black">SETTINGS</h1>
      <v-row>
        <v-col md="12">
          <v-sheet class="pa-5">
            <v-switch v-model="startup" inset :label="`Start server on start-up`"></v-switch>
            <v-switch v-model="notification" inset :label="`Enable Notification`"></v-switch>
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      notification: this.$store.getters.notification,
      startup: this.$store.getters.startup
    };
  },
  watch: {
    notification() {
      this.$store.dispatch("NOTIFICATION_TOGGLE");
    },
    startup() {
      this.$store.dispatch("STARTUP_TOGGLE");
    }
  }
};
</script>

<style>
</style>