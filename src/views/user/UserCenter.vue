<template>
  <page
    title="用户中心"
    :desc="userInfo.lastLoginIp"
  >

    <div
      id="UserCenter"
      slot="content"
    >
      <div class="row">
        <cube-input
          disabled
          v-model="userInfo.createTime"
          placeholder="信息待补充"
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
          placeholder="信息待补充"
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
          placeholder="信息待补充"
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
          placeholder="信息待补充"
          type="number"
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
          placeholder="信息待补充"
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
          disabled
          placeholder="信息待补充"
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
        <cube-button
          @click="updatePwd"
          light
          style="margin: 0 20px;"
        >
          修改密码
        </cube-button>
        <cube-button
          @click="updateStuInfo"
          light
          style="margin: 0 20px;"
        >
          修改教务信息
        </cube-button>
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
      <div class="row-footer">
        <cube-button @click="loginOut">
          退出登陆
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
        uid: null, // 用户ID
        username: null,
        email: null,
        createTime: null,
        mobile: null,
        wechat: null,
        studentId: null, // 教务账号
        lastLoginIp: null, // 上次登陆IP
      },
      errorToast: this.$createToast({
        type: 'warn',
        time: 2000,
        txt: '网络错误！',
      }, false), // api请求，网络错误提示
    };
  },
  methods: {
    // 获取个人信息
    getUserInfo() {
      api.getUserInfo().then(({ data }) => {
        if (data.Code === 200) {
          this.userInfo = data.Data;
          console.log(data.Data);
        } else {
          this.$createToast({
            txt: data.Msg,
            type: 'error',
          }).show();
          // 300为未登陆
          if (data.Code === 300) {
            setTimeout(() => {
              this.$router.push({
                name: 'account',
                params: 'login',
              });
            }, 1000);
          }
        }
      }).catch((e) => {
        this.errorToast.show();
        console.log(e);
      });
      this.canEdit = false;
    },
    // 更新密码
    updatePwd() {
      this.$createDialog({
        type: 'prompt',
        title: '校验旧密码',
        prompt: {
          placeholder: '请输入旧密码',
          eye: { open: false, reverse: false },
          type: 'password',
        },
        onConfirm: (e, promptValue) => {
          if (promptValue && promptValue.length >= 8) {
            const body = {
              password: promptValue,
            };
            api.checkPwd(body).then(({ data }) => {
              if (data.Code === 200) {
                this.setNewPwd();
              } else {
                this.$createToast({
                  type: 'warn',
                  time: 1000,
                  txt: data.Msg,
                }).show();
              }
            }).catch((error) => {
              console.log(error);
              this.errorToast.show();
            });
          } else {
            this.$createToast({
              type: 'warn',
              time: 1000,
              txt: '密码错误！',
            }).show();
          }
        },
      }, false).show();
    },
    // 设置新密码
    setNewPwd() {
      const re = /^(?=.*\d)(?=.*[a-zA-Z]).{8,25}$/;
      const newPwdDialog = this.$createDialog({
        type: 'prompt',
        title: '设置新密码',
        prompt: {
          placeholder: '请输入新密码',
          eye: { open: false, reverse: false },
          type: 'password',
        },
        onConfirm: (e, inputValue) => {
          const newPwd = inputValue;
          if (!re.test(newPwd)) {
            this.$createToast({
              type: 'warn',
              time: 1000,
              txt: '密码必须包含字母和数字，不能使用特殊字符，至少为8位！',
            }).show();
          } else {
            api.updatePwd({
              password: inputValue,
            }).then((response) => {
              if (response.data.Code === 200) {
                this.$createToast({
                  type: 'success',
                  time: 1000,
                  txt: '密码修改成功，刷新后请重新登陆',
                }).show();
                setTimeout(() => {
                  this.$router.push({
                    name: 'account',
                    params: 'login',
                  });
                }, 2000);
              } else {
                this.$createToast({
                  type: 'warn',
                  time: 2000,
                  txt: response.data.Msg,
                }).show();
              }
            }).catch((error) => {
              console.log(error);
              this.errorToast.show();
            });
          }
        },
      }, false);
      newPwdDialog.show();
    },
    // 修改教务信息
    updateStuInfo() {
      this.$createDialog({
        type: 'prompt',
        title: '修改教务信息',
        prompt: {
          placeholder: '请输入教务账号',
          clearable: { visible: true, blurHidden: true },
        },
        onConfirm: (e, inputValue) => {
          if (inputValue && inputValue.length > 0) {
            this.updateStuPwd(inputValue);
          } else {
            this.$createToast({
              type: 'warn',
              time: 2000,
              txt: '请输入正确的教务账号',
            }).show();
          }
        },
      }, false).show();
    },
    // 修改教务密码
    updateStuPwd(stuId) {
      this.$createDialog({
        type: 'prompt',
        title: '修改教务信息',
        prompt: {
          placeholder: '请输入教务密码',
          type: 'password',
          clearable: { visible: true, blurHidden: true },
          eye: { open: false, reverse: false },
        },
        onConfirm: (e, inputValue) => {
          if (inputValue && inputValue.length > 0) {
            const body = {
              studentId: stuId,
              studentPwd: inputValue,
            };
            api.updateStuInfo(body).then(({ data }) => {
              if (data.Code === 200) {
                this.$createToast({
                  type: 'success',
                  time: 2000,
                  txt: '更新成功',
                }).show();
                this.getUserInfo();
              } else {
                this.$createToast({
                  type: 'warn',
                  time: 2000,
                  txt: data.Msg,
                }).show();
              }
            }).catch((error) => {
              this.errorToast.show();
              console.log(error);
            });
          } else {
            this.$createToast({
              type: 'error',
              time: 2000,
              txt: '请输入正确的密码！',
            }).show();
          }
        },
      }, false).show();
    },
    // 保存个人信息修改
    save() {
      const reMobile = /^1[0-9]{10}$/;
      if (this.userInfo.mobile && !reMobile.test(this.userInfo.mobile)) {
        this.$createToast({
          txt: '手机号格式错误！',
          type: 'error',
        }).show();
        return;
      }
      const reWechat = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
      if (this.userInfo.wechat && !reWechat.test(this.userInfo.wechat)) {
        this.$createToast({
          txt: '微信号格式错误！',
          type: 'error',
        }).show();
        return;
      }
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
        this.errorToast.show();
        console.log(e);
      });
    },
    // 退出登陆
    loginOut() {
      api.loginOut().then(({ data }) => {
        if (data.Code === 200) {
          this.$createToast({
            txt: '退出成功',
            type: 'success',
          }).show();
          setTimeout(() => {
            this.$router.push({
              name: 'account',
              params: 'login',
            });
          }, 1000);
        }
      }).catch((e) => {
        this.errorToast.show();
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
