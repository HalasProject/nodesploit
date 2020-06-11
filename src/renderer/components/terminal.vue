<template>
  <v-container @click="$refs.cmd.focus();" class="pt-10">
    <div ref="terminal" :style="{'color':this.$vuetify.secondary}" id="container">
      <div class="mb-8">
        <p>
          <img
            align="left"
            class="mr-8"
            src="https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png"
            width="86"
            height="100"
          />
        </p>
        <h2 style="letter-spacing: 4px" class="display-1">{{header}} : {{socket.id}}</h2>
        <p>{{subHeader}}</p>
        <p>{{helpHeader}}</p>
        <p></p>
      </div>
      <output ref="output"></output>
      <div id="input-line" class="input-line">
        <div class="prompt">
          (
          <div v-if="showemoji">💀</div>
          <div v-if="!showemoji">☠️</div>) NodeSploit >>
        </div>

        <input
          v-model="value"
          ref="cmd"
          @keydown.enter="cmd_enter($event)"
          @keydown.up="history_up()"
          @keydown.down="history_down()"
          @keydown.tab="cmd_tab($event)"
          class="cmdline"
          autofocus
        />
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    shell_output: {
      type: String
    },
    socket: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showemoji: true,
      header: "Shell",
      subHeader: "Shell is power just enjoy 🔥",
      helpHeader: 'Enter "help" for more information.',
      CMDS_: ["♦️ info", "♦️ clear", "♦️ help", "♦️ uname"],
      value: "",
      history_: [],
      histpos_: 0,
      histtemp_: 0
    };
  },
  watch: {
    shell_output(val) {
      this.output(val);
      this.$vuetify.goTo(document.body.scrollHeight);
    }
  },
  methods: {
    history_up() {
      if (this.history_.length) {
        if (this.history_[this.histpos_]) {
          this.history_[this.histpos_] = this.value;
        } else {
          this.histtemp_ = this.value;
        }
      }
      // up 38
      this.histpos_--;
      if (this.histpos_ < 0) {
        this.histpos_ = 0;
      }
      this.value = this.history_[this.histpos_]
        ? this.history_[this.histpos_]
        : this.histtemp_;
      this.value = this.value; // Sets cursor to end of input.
    },
    history_down() {
      if (this.history_.length) {
        if (this.history_[this.histpos_]) {
          this.history_[this.histpos_] = this.value;
        } else {
          this.histtemp_ = this.value;
        }
      }
      // down 40
      this.histpos_++;
      if (this.histpos_ > this.history_.length) {
        this.histpos_ = this.history_.length;
      }
      this.value = this.history_[this.histpos_]
        ? this.history_[this.histpos_]
        : this.histtemp_;
      this.value = this.value; // Sets cursor to end of input.
    },
    cmd_tab(e) {
      // tab 9
      e.preventDefault();
    },
    cmd_enter(e) {
      // enter 13
      // Save shell history.
      if (this.value) {
        this.history_[this.history_.length] = this.value;
        this.histpos_ = this.history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.$refs.cmd.parentNode.cloneNode(true);
      line.removeAttribute("id");
      line.classList.add("line");
      var input = line.querySelector("input.cmdline");
      input.autofocus = false;
      input.readOnly = true;
      this.$refs.output.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(" ").filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case "info":
          this.output(`<div class=''><p>
                              <p>
                    888b    888               888           .d8888b.  888      8888888 
                    8888b   888               888          d88P  Y88b 888        888   
                    88888b  888               888          888    888 888        888   
                    888Y88b 888  .d88b.   .d88888  .d88b.  888        888        888   
                    888 Y88b888 d88""88b d88" 888 d8P  Y8b 888        888        888   
                    888  Y88888 888  888 888  888 88888888 888    888 888        888   
                    888   Y8888 Y88..88P Y88b 888 Y8b.     Y88b  d88P 888        888   
                    888    Y888  "Y88P"   "Y88888  "Y8888   "Y8888P"  88888888 8888888 
                                                                                       
                          👽*. NodeSploit v1 By Salah Eddine Bentayeb .*👽                                                                   
                                                                                       
                    </p></div>`);
          break;

        case "clear":
          this.$refs.output.innerHTML = "";
          this.value = "";
          return;

        case "help":
          this.output(
            '<div class="ls-files">' + this.CMDS_.join("<br>") + "</div>"
          );
          break;

        case "uname":
          this.output(navigator.appVersion);
          break;

        default:
          if (cmd) {
            this.$emit("terminal_cmd", this.value);
          }
      }

      this.value = ""; // Clear/setup line for next input.
    },
    output(html) {
      this.$refs.output.insertAdjacentHTML(
        "beforeEnd",
        "<pre>" + html + "</pre>"
      );
    }
  },
  mounted() {
    setInterval(() => {
      this.showemoji = !this.showemoji;
    }, 750);
  }
};
</script>

<style>
#container {
  font-size: 11pt;
  font-family: Inconsolata, monospace;
  padding: 0.5em 1.5em 1em 1em;
}
#container output {
  clear: both;
  width: 100%;
}
.input-line {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-align: stretch;
  display: -moz-box;
  -moz-box-orient: horizontal;
  -moz-box-align: stretch;
  display: box;
  box-orient: horizontal;
  box-align: stretch;
  clear: both;
}
.input-line > div:nth-child(2) {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  box-flex: 1;
}
.prompt {
  white-space: nowrap;
  color: #3a8b17;
  margin-right: 7px;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  box-pack: center;
  box-orient: vertical;
  user-select: none;
}
.cmdline {
  outline: none;
  background-color: transparent;
  margin: 0;
  width: 100%;
  font: inherit;
  border: none;
  color: inherit;
}
.ls-files {
  height: 45px;
  column-width: 100px;
}
</style>