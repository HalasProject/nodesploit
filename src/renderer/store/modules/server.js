const state = {
  listen: false,
  ip:null,
  port: null,
};

const mutations = {
  LISTENED_ON(state, connection) {
    state.ip = connection.ip
    state.listen = true;
    state.port = connection.port;
  },
  LISTENED_OFF(state) {
    state.listen = false;
    state.ip = null;
    state.port = null;
  },
};

const getters = {
  is_open(state) {
    return state.listen;
  },
  port(state) {
    return state.port;
  },
  ip(state) {
    return state.ip;
  },
};

const actions = {
  LISTENED({ commit }, connection) {
    commit("LISTENED_ON", connection);
  },
  STOPLISTEN({ commit }) {
    commit("LISTENED_OFF");
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
