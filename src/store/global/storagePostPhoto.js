import storage from '@/requests/storage';

export default {
  namespaced: true,
  state: {
    storagePostPhoto: null,
  },
  getters: {
    getStoragePostPhoto: (s) => s.storagePostPhoto,
  },
  mutations: {
    setStoragePostPhoto: (s, value) => {
      s.storagePostPhoto = value;
    },
  },
  actions: {
    async apiStoragePostPhoto({ commit }, file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await storage.postPhoto(formData);
      commit('setStoragePostPhoto', response.data.imagePath);
    },
  },
};
