<template>
  <div>
    <h1 class="display-4 font-weight-black mb-4">SERVER</h1>

    <div class="text-center" v-if="serverOpen">
      <h3 class="headline font-weight-thin mt-4">SERVER LISTEN IN PORT {{serverPort}}</h3>
      <v-btn @click="stopListen()" class="mt-4" large color="error">STOP</v-btn>
    </div>
    <form v-else>
      <v-text-field
        v-model="ip"
        :error-messages="ipErrors"
        label="IP Adresse"
        required
        @input="$v.ip.$touch()"
        @blur="$v.ip.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="port"
        :error-messages="portErrors"
        label="Port"
        required
        @input="$v.port.$touch()"
        @blur="$v.port.$touch()"
      ></v-text-field>
      <v-checkbox
        v-model="remember"
        label="Remember this config?"
        required
        @change="$v.remember.$touch()"
        @blur="$v.remember.$touch()"
      ></v-checkbox>

      <v-btn class="mr-4" @click="submit">Listen</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>
  </div>
</template>

<script>
import {
  required,
  ipAddress,
  integer,
  between
} from "vuelidate/lib/validators";

import { ipcRenderer } from "electron";

export default {
  data: () => ({
    ip: require("ip").address(),
    port: "",
    remember: false
  }),
  validations: {
    ip: {
      required,
      ipAddress
    },
    port: {
      integer,
      between: between(1, 65536),
      required
    },
    remember: {
      checked(val) {
        return val;
      }
    }
  },
  computed: {
    ipErrors() {
      const errors = [];
      if (!this.$v.ip.$dirty) return errors;
      !this.$v.ip.ipAddress && errors.push("IPv4 format required !");
      !this.$v.ip.required && errors.push("IP Adresse is required.");
      return errors;
    },
    portErrors() {
      const errors = [];
      if (!this.$v.port.$dirty) return;

      !this.$v.port.integer && errors.push("Port must be a number");
      !this.$v.port.between && errors.push(`Port must be between 1 and 65536`);
      !this.$v.port.required && errors.push("Port is required");
      return errors;
    },
    serverOpen() {
      return this.$store.getters.is_open;
    },
    serverPort() {
      return this.$store.getters.port;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      ipcRenderer
        .invoke("serverlisten", {
          ip: this.ip,
          port: this.port,
          remember: this.remember
        })
        .then(() => {
          this.$store.dispatch("LISTENED", { port: this.port, ip: this.ip });
        });
    },
    stopListen() {
      ipcRenderer.invoke("server-stoplisten").then(() => {
        this.$store.dispatch("STOPLISTEN");
      });
    },
    clear() {
      this.$v.$reset();
      this.ip = "";
      this.port = "";
      this.remember = false;
    }
  }
};
</script>

<style lang="css">
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid rgb(12, 7, 7);
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
