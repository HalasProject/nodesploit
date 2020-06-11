const state = {
  notification: true,
  startup: true,
};

const mutations = {
  NOTIFICATION(state) {
    state.notification = !state.notification;
  },
  STARTUP(state) {
    state.startup = !state.startup;
  },
};

const getters = {
  notification(state) {
    return state.notification;
  },
  startup(state) {
    return state.startup;
  },
};

const actions = {
  NOTIFICATION_TOGGLE({ commit }) {
    commit("NOTIFICATION");
  },
  STARTUP_TOGGLE({ commit }) {
    commit("STARTUP");
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
