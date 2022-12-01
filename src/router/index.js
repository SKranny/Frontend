import Vue from 'vue';
import Router from 'vue-router';

import authRoutes from './modules/auth';
import shiftRoutes from './modules/shift';
import userRoutes from './modules/user';
import adminRoutes from './modules/admin';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: {
      name: 'News',
    },
  },
].concat(authRoutes, shiftRoutes, userRoutes, adminRoutes);
export default new Router({
  routes,
  mode: 'history',
});
