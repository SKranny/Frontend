import friends from '@/requests/friends';
import createQuery from '@/utils/createQuery';

const dispatchSetAlert = (dispatch, text) =>
  dispatch('global/alert/setAlert', { status: 'success', text }, { root: true });

const dispatchSearchUsers = (dispatch, users) =>
  dispatch('global/search/searchUsers', users, {
    root: true,
  });

export default {
  namespaced: true,
  state: {
    result: {
      friends: [],
      request: [],
      recommendations: [],
    },
    friends: {},
    paginations: {},
    requestsCount: null,
  },

  getters: {
    getResult: (s) => s.result,
    getResultById: (s) => (id) => s.result[id],
  },

  mutations: {
    setResult: (s, payload) => (s.result[payload.id] = payload.value),

    setFriends: (s, payload) => {
      payload.forEach((user) => {
        const { statusCode } = user;
        const isDouble = !s.friends[statusCode]
          ? false
          : s.friends[statusCode].find((currentUser) => currentUser.id === user.id);

        if (isDouble) return;

        s.friends = {
          ...s.friends,
          [statusCode]: s.friends[statusCode] ? [...s.friends[statusCode], user] : [user],
        };
      });
    },
    setRequestsCount: (s, payload) => {
      s.requestsCount = payload;
    },

    setPaginations: (s, { number, totalPages, field }) => {
      s.paginations[field] = { number, totalPages };
    },
  },

  actions: {
    async apiFriends({ commit }, payload) {
      const query = createQuery(payload);
      const { data } = await friends.get(query);
      const { content } = data;
      const { number, totalPages } = data;
      commit('setResult', { id: 'friends', value: content || [] });
      commit('setFriends', content);
      commit('setPaginations', { number, totalPages, field: payload.statusCode });
    },

    async apiDeleteFriends({ dispatch }, id) {
      await friends.delete(id);
      dispatchSetAlert(dispatch, 'Пользователь удален из друзей');
      dispatch('apiFriends');
    },

    async apiAddFriends({ dispatch, getters, rootGetters }, { id, isApprove = false }) {
      const _friend = getters.getResult.friends.find((fr) => fr.id === id);

      if (_friend && _friend.statusCode === 'REQUEST_TO') {
        dispatchSetAlert(dispatch, 'Вы уже отправляли запрос этому пользователю!');
        return;
      }

      if (_friend && _friend.statusCode === 'REJECTING') {
        dispatchSetAlert(dispatch, 'Этот пользователь заблокировал Вас!');
        return;
      }

      if (_friend && _friend.statusCode === 'BLOCKED') {
        dispatchSetAlert(dispatch, 'Вы заблокировали этого пользователя!');
        return;
      }

      if (_friend && _friend.statusCode === 'FRIEND') {
        dispatchSetAlert(dispatch, 'Вы уже друзья с этим пользователем!');
        return;
      }

      const { data } = await friends.addFriends(id, isApprove);

      if (data && data.message === 'request already sent!') {
        dispatchSetAlert(dispatch, 'Вы уже отправляли запрос этому пользователю!');
      } else if (data && data.message === 'Blocked!') {
        dispatchSetAlert(dispatch, 'Этот пользователь заблокировал Вас!');
      } else dispatchSetAlert(dispatch, 'Заявка отправлена');

      dispatch('apiFriends');
      dispatchSearchUsers(dispatch, rootGetters['global/search/getLastSearchUsersRequest']);
    },

    async apiSubscribe({ dispatch, rootGetters }, id) {
      await friends.addSubscribe(id);

      dispatchSetAlert(dispatch, 'Заявка отправлена');
      dispatch('apiFriends');
      dispatchSearchUsers(dispatch, rootGetters['global/search/getLastSearchUsersRequest']);
    },

    async apiRequest({ commit }, payload) {
      const query = createQuery(payload);
      const { data } = await friends.getRequest(query);
      commit('setResult', { id: 'request', value: data });
    },

    async apiRecommendations({ commit }, payload) {
      const query = createQuery(payload);
      const { data } = await friends.getRecommendations(query);
      commit('setResult', { id: 'recommendations', value: data || [] });
    },

    async apiRequestsCount({ commit }) {
      const { data } = await friends.friendRequestsCount();
      commit('setRequestsCount', data);
    },
  },
};
