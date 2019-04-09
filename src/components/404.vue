<template>
  <Page id="notfound">
    <div
      slot="content"
      class="content"
    >
      <h1>Sorry! 404 Not Found!</h1>
    </div>
  </Page>
</template>

<script>
import Page from './Page.vue';

export default {
  components: {
    Page,
  },
  name: 'NotFound',

  data() {
    return {

    };
  },
  methods: {

  },
};
</script>

<style lang='less'>
.content {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
