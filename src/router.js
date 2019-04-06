import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/schedule',
    },
    {
      path: '/account/:type',
      name: 'account',
      component: () => import('./views/user/Index.vue'),
    },
    {
      path: '/user/center',
      name: 'user_center',
      component: () => import('@/views/user/UserCenter.vue'),
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('@/views/schedule/Index.vue'),
    },
  ],
});
