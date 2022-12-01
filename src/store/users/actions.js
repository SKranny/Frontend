import friends from '@/requests/friends';

export default {
  namespaced: true,
  actions: {
    async apiBlockUser({ dispatch }, id) {
      await friends.changeBlockUser(id);

      dispatch(
        'global/alert/setAlert',
        { status: 'success', text: 'Пользователь заблокирован' },
        { root: true }
      );
      dispatch('profile/friends/apiFriends', null, { root: true });
      dispatch('global/search/searchUsers', 'global/search/getLastSearchUsersRequest', {
        root: true,
      });
    },

    async apiUnblockUser({ dispatch }, id) {
      const response = await friends.changeBlockUser(id);
      dispatch(
        'global/alert/setAlert',
        { status: 'success', text: 'Пользователь разблокирован' },
        { root: true }
      );
      dispatch('profile/friends/apiFriends', null, { root: true });
      dispatch('global/search/searchUsers', 'global/search/getLastSearchUsersRequest', {
        root: true,
      });
      console.log('TCL: apiUnblockUser -> response', response);
    },
  },
};
