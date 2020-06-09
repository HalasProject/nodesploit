import Vue from "vue";
import Vuetify from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: "mdi",
  },
  theme: {
      dark:false,
      default: 'light',
      options: {
        themeCache: {
          get: key => localStorage.getItem(key),
          set: (key, value) => localStorage.setItem(key, value),
        },
      },
  },
};

export default new Vuetify(opts);
