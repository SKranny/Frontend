<template>
  <exit-icon v-if="name === 'exit'" />
  <profile-icon v-else-if="name === 'profile'" />
  <settings-icon v-else-if="name === 'settings'" />
  <friends-icon v-else-if="name === 'friends'" />
  <im-icon v-else-if="name === 'im'" />
  <news-icon v-else-if="name === 'news'" />
  <comments-icon v-else-if="name === 'comments'" />
  <moderators-icon v-else-if="name === 'moderators'" />
  <posts-icon v-else-if="name === 'posts'" />
  <statistics-icon v-else-if="name === 'statistics'" />
  <users-icon v-else-if="name === 'users'" />
  <span v-else />
</template>

<script>
export default {
  components: {
    ExitIcon: () => import('./ExitIcon.vue'),
    ProfileIcon: () => import('./ProfileIcon.vue'),
    SettingsIcon: () => import('./SettingsIcon.vue'),
    FriendsIcon: () => import('./FriendsIcon.vue'),
    ImIcon: () => import('./ImIcon.vue'),
    NewsIcon: () => import('./NewsIcon.vue'),
    CommentsIcon: () => import('./CommentsIcon.vue'),
    ModeratorsIcon: () => import('./ModeratorsIcon.vue'),
    PostsIcon: () => import('./PostsIcon.vue'),
    StatisticsIcon: () => import('./StatisticsIcon.vue'),
    UsersIcon: () => import('./UsersIcon.vue'),
  },
  props: ['name'],
};
</script>
