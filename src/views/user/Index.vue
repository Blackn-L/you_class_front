<template>
  <page
    id="index"
    title="注册/登陆"
  >

    <div
      slot="content"
      class="container"
    >
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
  </page>

</template>

<script>
import Register from './Register.vue';
import Login from './Login.vue';
import Page from '@/components/Page.vue';

export default {
  components: {
    Register,
    Login,
    Page,
  },
  name: 'Index',
  data() {
    return {
      selectedLabel: this.$route.params.type || 'login',
    };
  },
  methods: {

  },
};
</script>

<style lang="less">
#index {
  height: 100%;
  .container {
    margin-top: 2.375rem;
  }
}
</style>
