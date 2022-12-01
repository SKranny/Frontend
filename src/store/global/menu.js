export default {
  namespaced: true,
  state: {
    user: [
      {
        link: {
          name: 'Profile',
        },
        exact: true,
        icon: 'profile',
        text: 'Моя страница',
      },
      {
        link: {
          name: 'Friends',
        },
        icon: 'friends',
        text: 'Друзья',
      },
      {
        link: {
          name: 'Im',
        },
        icon: 'im',
        text: 'Сообщения',
      },
      {
        link: {
          name: 'News',
        },
        exact: true,
        icon: 'news',
        text: 'Новости',
      },
    ],
    admin: [
      {
        link: {
          name: 'AdminStatistics',
        },
        icon: 'statistics',
        text: 'Статистика',
      },
      {
        link: {
          name: 'AdminUsers',
        },
        icon: 'users',
        text: 'Люди',
      },
      {
        link: {
          name: 'AdminPosts',
        },
        icon: 'posts',
        text: 'Публикации',
      },
      {
        link: {
          name: 'AdminComments',
        },
        icon: 'comments',
        text: 'Комментарии',
      },
      {
        link: {
          name: 'AdminModerators',
        },
        icon: 'moderators',
        text: 'Администраторы и модераторы',
      },
    ],
  },
  getters: {
    getSidebarById: (state) => (id) => state[id],
  },
};
