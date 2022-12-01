import moment from 'moment';
import account from '@/requests/account';

export default {
  namespaced: true,
  state: {
    info: null,
  },

  getters: {
    getInfo(state) {
      if (!state.info) return;
      const result = {
        ...state.info,
      };
      result.fullName = result.firstName + ' ' + result.lastName;
      result.ages = moment().diff(result.birthDate, 'years');
      return result;
    },
  },

  mutations: {
    setInfo: (s, info) => (s.info = info),
  },

  actions: {
    async apiInfo({ commit }) {
      const response = await account.get();
      commit('setInfo', response.data);
    },

    async apiChangeInfo({ commit, dispatch }, user) {
      const response = await account.edit(user);

      dispatch(
        'global/alert/setAlert',
        { status: 'success', text: 'Информация обновлена' },
        { root: true }
      );

      commit('setInfo', response.data.data);
    },

    async deleteInfo() {
      await account.delete();
    },
  },
};
