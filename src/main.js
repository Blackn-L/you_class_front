import Vue from 'vue';
import './cube-ui';
import App from './App.vue';
import router from './router';
import 'amfe-flexible';
import './plugins/element';

Vue.config.productionTip = false;
Vue.prototype.apiStart = 'index.php';
// 设置标题
document.title = 'Your-Class';
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('email');
  if (!role && to.name !== 'account') {
    next({
      name: 'account',
      params: { type: 'login' },
    });
  } else {
    next();
  }
});
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
