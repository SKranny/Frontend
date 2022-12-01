export default [
  {
    path: '/admin/login',
    name: 'AdminLogin',
    meta: {
      layout: 'empty',
    },
    component: () => import('@/pages/Admin/Login.vue'),
  },
  {
    path: '/admin/statistics',
    name: 'AdminStatistics',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/Admin/Statistics.vue'),
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/Admin/Users.vue'),
  },
  {
    path: '/admin/comments',
    name: 'AdminComments',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/Admin/Comments.vue'),
  },
  {
    path: '/admin/posts',
    name: 'AdminPosts',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/Admin/Posts.vue'),
  },
  {
    path: '/admin/moderators',
    name: 'AdminModerators',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/Admin/Moderators.vue'),
  },
  {
    path: '/admin/moderators/edit',
    name: 'AdminEdit',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/Admin/Edit.vue'),
  },
];
