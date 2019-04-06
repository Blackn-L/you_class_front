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
      path: '/main',
      name: 'main',
      component: () => import('@/views/Main.vue'),
      children: [
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
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/Index.vue'),
        },
      ],
    },
    {
      path: '/account/:type',
      name: 'account',
      component: () => import('./views/user/Index.vue'),
    },
  ],
});
