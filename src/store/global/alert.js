export default {
  namespaced: true,
  state: {
    status: 'success',
    text: 'Сделано!',
    show: false,
    timeout: 2000,
  },
  getters: {
    getState: (s) => s,
  },
  mutations: {
    setInfo(state, value) {
      state.status = value.status;
      state.text = value.text;
    },
    toggleShow: (s) => (s.show = !s.show),
  },
  actions: {
    setAlert({ commit, state }, value) {
      commit('setInfo', value);
      commit('toggleShow');
      setTimeout(() => {
        commit('toggleShow');
      }, state.timeout);
    },
  },
};
