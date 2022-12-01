import auth from '@/requests/auth';
import requestSettings from '@/requests/settings';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('user-token') || '',
    jwt: '',
    status: '',
    pollingToken: null,
    refreshAttempts: 0,
    isCode: true,
  },
  getters: {
    apiToken: (s) => s.token,
    isAuthenticated: (state) => !!state.token,
    authStatus: (state) => state.status,
    getIsCode: (state) => state.isCode,
  },
  mutations: {
    setJwt: (s) => {
      const cookie = document.cookie.split('; ').reduce((acc, string) => {
        const [key, value] = string.split('=');
        acc[key] = value;
        return acc;
      }, {});

      s.jwt = cookie.jwt || '';
    },

    setToken: (s, token) => (s.token = token),
    setIsCode: (s, isCode) => (s.isCode = isCode),
    setStatus: (s, status) => (s.status = status),
    addAttempts: (s) => (s.refreshAttempts = s.refreshAttempts + 1),
    resetAttempts: (s) => (s.resetAttmpts = 0),
    setPollingInterval(state, interval) {
      state.pollingToken = interval;
    },
  },
  actions: {
    async register({ dispatch }, user) {
      await auth.register(user);

      dispatch(
        'global/alert/setAlert',
        { status: 'success', text: 'Зарегистрирован, делаю логин' },
        { root: true }
      );

      await dispatch('login', {
        email: user.email,
        password: user.password1,
      });
    },
    // pollingToken({ commit, dispatch }) {
    //   const interval = setInterval(() => {
    //     dispatch("refreshToken");
    //   }, 1000 * 600 * 1.5);
    //   commit("setPollingInterval", interval);
    // },
    async refreshToken({ commit, state, dispatch }) {
      if (state.refreshAttempts > 3) {
        console.warn('Cannot refresh token. Logging out...', state.pollingToken);
        dispatch('logout');
        clearInterval(state.pollingToken);
        return;
      }
      const refreshToken = localStorage.getItem('refresh-token');

      try {
        const response = await auth.refreshToken(refreshToken);
        // response.data
        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;

        localStorage.setItem('user-token', newAccessToken);
        localStorage.setItem('refresh-token', newRefreshToken);

        document.cookie = `jwt=${newAccessToken}`;
        requestSettings.setDefaultHeader('Authorization', `Bearer ${newAccessToken}`);
        commit('resetAttempts');
      } catch {
        console.warn('Cannot get new access token', state.refreshAttempts);
        commit('addAttempts');
      }
    },

    async login({ commit, dispatch }, user) {
      commit('setStatus', 'loading');
      try {
        const response = await auth.login(user);
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem('user-token', accessToken);
        localStorage.setItem('refresh-token', refreshToken);

        document.cookie = `jwt=${accessToken}`;
        requestSettings.setDefaultHeader('Authorization', `Bearer ${accessToken}`);

        commit('setJwt');
        commit('setToken', accessToken);
        commit('setStatus', 'success');
        commit('profile/info/setInfo', response.data, {
          root: true,
        });

        dispatch('pollingToken');
      } catch (error) {
        commit('setStatus', 'error');

        localStorage.removeItem('user-token');
        localStorage.removeItem('refresh-token');

        document.cookie = 'jwt=';
        commit('setJwt');
      }
    },

    async logout({ commit, dispatch, state }) {
      await auth.logout();

      commit('setToken', '');
      commit('setStatus', 'logout');

      dispatch(
        'global/alert/setAlert',
        { status: 'success', text: 'Вы вышли из системы' },
        { root: true }
      );

      localStorage.removeItem('user-token');
      localStorage.removeItem('refresh-token');

      document.cookie = 'jwt=';
      clearInterval(state.pollingToken);
      commit('setJwt');
      requestSettings.deleteDefaultHeader('Authorization');
    },
  },
};
