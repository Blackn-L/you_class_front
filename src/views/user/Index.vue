<template>
  <div id="index">
    <cube-tab-bar
      v-model="selectedLabel"
      show-slider
    >

      <cube-tab
        label="注册"
        value="register"
      >
      </cube-tab>

      <cube-tab
        label="登陆"
        value="login"
      >
      </cube-tab>

    </cube-tab-bar>

    <cube-tab-panels v-model="selectedLabel">
      <cube-tab-panel
        label="注册"
        value="register"
      >
        <register></register>
      </cube-tab-panel>
      <cube-tab-panel
        label="登陆"
        value="login"
      >
        <login></login>
      </cube-tab-panel>
    </cube-tab-panels>
  </div>
</template>

<script>
import Register from './Register.vue';
import Login from './Login.vue';

export default {
  components: {
    Register,
    Login,
  },
  name: 'Index',
  data() {
    return {
      selectedLabel: 'login',
    };
  },
};
</script>

<style scoped>
</style>
