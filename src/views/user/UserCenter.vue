<template>
  <page
    title="用户中心"
    desc="上次登陆时间登陆IP"
  >

    <div
      id="UserCenter"
      slot="content"
    >
      <!-- <header class="header">
        用户中心

      </header> -->
      <div class="row">
        <cube-input
          disabled
          v-model="userInfo.createdTime"
          class="row-input"
        >

        </cube-input>
        <div slot="prepend">
          <span style="font-size: 16px">
            注册时间
          </span>
        </div>
      </div>
      <div class="row">
        <cube-input
          v-model="userInfo.username"
          :disabled='!canEdit'
          class="row-input"
        >

        </cube-input>
        <div slot="prepend">
          <span style="font-size: 16px">
            用户名
          </span>
        </div>
      </div>
      <div class="row">
        <cube-input
          v-model="userInfo.email"
          :disabled='!canEdit'
          class="row-input"
        >

        </cube-input>
        <div slot="prepend">
          <span style="font-size: 16px">
            绑定邮箱
          </span>
        </div>
      </div>

      <div class="row">
        <cube-input
          v-model="userInfo.mobile"
          :disabled='!canEdit'
          class="row-input"
        >

        </cube-input>
        <div slot="prepend">
          <span style="font-size: 16px">
            手机号
          </span>
        </div>
      </div>
      <div class="row">
        <cube-input
          v-model="userInfo.wechat"
          :disabled='!canEdit'
          type="number"
          class="row-input"
        >

        </cube-input>
        <div slot="prepend">
          <span style="font-size: 16px">
            微信
          </span>
        </div>
      </div>
      <div class="row">
        <cube-input
          v-model="userInfo.studentId"
          :disabled='!canEdit'
          class="row-input"
        >

        </cube-input>
        <div slot="prepend">
          <span style="font-size: 16px">
            教务账号
          </span>
        </div>
      </div>
      <div
        class="row-footer"
        style="display: flex; align-items: center;"
      >
        <cube-switch
          v-model="canEdit"
          style="width:30%; float: left; margin:0 10%"
        >
        </cube-switch>
        <cube-button
          style="width:40%; float: right; margin-right: 10%;"
          :disabled="!canEdit"
          @click="save"
        >
          {{canEdit ? '保存' : '滑动修改'}}
        </cube-button>
      </div>
    </div>
  </page>

</template>

<script>
import api from '@/api/user';
import Page from '@/components/Page.vue';

export default {
  name: 'UserCenter',
  components: {
    Page,
  },
  data() {
    return {
      canEdit: false, // 能否修改
      userInfo: {
        username: null,
        email: null,
        createdTime: null,
        mobile: null,
        wechat: null,
        studentId: null, // 教务账号
      },
    };
  },
  methods: {
    // 获取个人信息
    getUserInfo() {
      api.getUserInfo().then(({ data }) => {
        console.log(data);
        this.userInfo = data.Data;
      });
    },
    // 保存个人信息修改
    save() {
      const body = this.userInfo;
      api.saveUserInfo(body).then(({ data }) => {
        if (data.Code === 200) {
          this.$createToast({
            txt: '保存成功',
            type: 'success',
          }).show();
          this.getUserInfo();
        } else {
          this.$createToast({
            txt: data.Msg,
            type: 'error',
          }).show();
        }
      }).catch((e) => {
        console.log(e);
      });
    },
  },
  created() {
    this.getUserInfo();
  },
};

</script>

<style scoped>
.row {
  margin: 0.4rem 0.625rem;
  border-radius: 0.2rem;
}
.row-input {
  width: 70%;
  float: right;
  margin: 0 0.1rem;
}
.row-footer {
  margin: 0.6rem 0.625rem;
}
</style>
