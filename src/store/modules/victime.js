const state = {
  childs: []
}

const mutations = {
  NEW_CHILD (state, socket) {
    state.childs.push(socket)
  },
  REMOVE_CHILD (state, id) {
    var removeIndex = state.childs.map((child) => child.id).indexOf(id)
    if (removeIndex !== -1) {
      state.childs.splice(removeIndex, 1)
    }
  },
  ADD_INFORMATION (state, info) {
    state.childs.map((child) => {
      if (child.id === info.id) {
        // eslint-disable-next-line no-return-assign
        return child[info.property.name] = info.property.data
      }
    })
  }
}

const getters = {
  childs (state) {
    return state.childs
  }
}

const actions = {
  ADD_CHILD ({ commit }, child) {
    commit('NEW_CHILD', child)
  },
  REMOVE_CHILD ({ commit }, id) {
    commit('REMOVE_CHILD', id)
  },
  ADD_INFORMATION ({ commit }, child) {
    commit('ADD_INFORMATION', child)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
