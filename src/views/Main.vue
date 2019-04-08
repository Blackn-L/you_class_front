<template>
  <div
    id="main"
    class="fullHeight"
  >
    <cube-tab-bar
      class="tabs"
      v-model="defaultTab"
      @change="changeHandler"
      show-slider
    >
      <cube-tab
        v-for="item in tabs"
        :icon="item.icon"
        :label="item.label"
        :key="item.value"
        :value="item.value"
      >
      </cube-tab>
    </cube-tab-bar>

    <cube-tab-panels v-model="defaultTab">
      <cube-tab-panel
        class="fullHeight"
        v-for="item in tabs"
        :label="item.label"
        :key="item.value"
        :value="item.value"
      >
        <div
          v-if="$route.name === item.value"
          ref="routerView"
          class="fullHeight"
        >
          <router-view></router-view>
        </div>
      </cube-tab-panel>
    </cube-tab-panels>
  </div>
</template>

<script>
export default {
  components: {

  },
  name: 'Main',

  data() {
    return {
      routerHeight: '600px',
      defaultTab: 'schedule',
      tabs: [
        {
          label: '课程表',
          value: 'schedule',
          icon: 'cubeic-like',
          path: '/schedule',
        },
        {
          label: '主页',
          value: 'home',
          icon: 'cubeic-home',
          path: '/user/center',
        },
        {
          label: '个人中心',
          value: 'user_center',
          icon: 'cubeic-vip',
          path: '/user/center',
        },
      ],
    };
  },
  mounted() {
    this.defaultTab = this.$route.name || 'schedule';
  },
  methods: {
    changeHandler(val) {
      this.$router.push({ name: val });
    },
  },
};
</script>

<style lang="less">
.fullHeight {
  height: 100%;
}
.tabs {
  font-size: 0.4rem;
}
</style>
