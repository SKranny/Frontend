import languages from '@/requests/languages';

export default {
  namespaced: true,
  state: {
    languages: [],
    active: {
      id: 1,
      title: 'Русский',
    },
    isOpenBlock: false,
  },
  getters: {
    getLanguages: (s) => s.languages,
    getActiveLanguage: (s) => s.active.title,
    getStatusOpenBlock: (s) => s.isOpenBlock,
  },
  mutations: {
    setLanguages: (s, value) => (s.languages = value),
    setActiveLanguage: (state, lang) => (state.active = lang),
    toggleLanguageBlock: (s) => (s.isOpenBlock = !s.isOpenBlock),
  },
  actions: {
    async apiLanguages({ commit }) {
      const response = await languages.get();
      commit('setLanguages', response.data.data);
    },
  },
};
