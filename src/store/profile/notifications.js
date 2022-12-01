import notifications from '@/requests/notifications';

export default {
  namespaced: true,
  state: {
    notifications: [],
    notificationsLength: 0,
  },
  getters: {
    getNotifications: (s) => s.notifications,
    getNotificationsLength: (s) => s.notificationsLength,
    getNotificationsTextType: () => (type) => {
      switch (type) {
        case 'POST':
          return 'опубликовал новую запись';
        case 'POST_COMMENT':
          return 'оставил комментарий';
        case 'COMMENT_COMMENT':
          return 'ответил на ваш комментарий';
        case 'FRIEND_REQUEST':
          return 'от пользователя';
        case 'FRIEND_BIRTHDAY':
          return 'день рождение';
        case 'MESSAGE':
          return 'прислал сообщение';
      }
    },
  },
  mutations: {
    setNotifications: (s, value) => (s.notifications = value),
    setNotificationsLength: (s, value) => (s.notificationsLength = value),
    addNotification(state, notification) {
      state.notifications.unshift(notification);
    },

    addNotificationsLength(state, notification) {
      if (notification.notificationType) state.notificationsLength = state.notificationsLength + 1;
    },
  },

  actions: {
    async fetchNotifications({ commit }) {
      const response = await notifications.get();
      commit('setNotifications', response.data.data);
    },

    async fetchNotificationsLength({ commit }) {
      const response = await notifications.getLength();
      commit('setNotificationsLength', response.data.data.count);
    },
  },
};
