const state = {
  listen: false,
  ip: null,
  port: null,
  childs: [],
};

const mutations = {
  LISTENED_ON(state, connection) {
    state.ip = connection.ip;
    state.listen = true;
    state.port = connection.port;
  },
  LISTENED_OFF(state) {
    state.listen = false;
    state.ip = null;
    state.port = null;
  },
  NEW_CHILD(state, socket) {
    state.childs.push(socket);
  },
  REMOVE_CHILD(state, id) {
    var removeIndex = state.childs.map((child) => child.id).indexOf(id);
    if (removeIndex != -1) {
      state.childs.splice(removeIndex, 1);
    }

    // Filter in array doesnt work for me !!
    // state.childs = state.childs.filter(function(child) {
    //   return child.id !== id;
    // });
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
  childs(state) {
    return state.childs;
  },
};

const actions = {
  LISTENED({ commit }, connection) {
    commit("LISTENED_ON", connection);
  },
  STOPLISTEN({ commit }) {
    commit("LISTENED_OFF");
  },
  ADD_CHILD({ commit }, child) {
    commit("NEW_CHILD", child);
  },
  REMOVE_CHILD({ commit }, id) {
    commit("REMOVE_CHILD", id);
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
