<template>
  <page
    :desc="userInfo.lastLoginIp"
    id="usercenter"
  >
    <div slot="content">
      <cube-form>
        <cube-form-group>
          <cube-form-item
            :field="fields[0]"
            class="form"
          >
            <cube-input
              disabled
              v-model="userInfo.createTime"
              placeholder="信息待补充"
            >
            </cube-input>
          </cube-form-item>
          <cube-form-item
            :field="fields[1]"
            class="form"
          >
            <cube-input
              v-model="userInfo.username"
              :disabled='!canEdit'
              placeholder="信息待补充"
            >
            </cube-input>
          </cube-form-item>
          <cube-form-item
            :field="fields[2]"
            class="form"
          >
            <cube-input
              v-model="userInfo.email"
              :disabled='!canEdit'
              placeholder="信息待补充"
            >
            </cube-input>
          </cube-form-item>
          <cube-form-item
            :field="fields[3]"
            class="form"
          >
            <cube-input
              v-model="userInfo.mobile"
              :disabled='!canEdit'
              placeholder="信息待补充"
              type="number"
            >
            </cube-input>
          </cube-form-item>
          <cube-form-item
            :field="fields[4]"
            class="form"
          >
            <cube-input
              v-model="userInfo.wechat"
              :disabled='!canEdit'
              placeholder="信息待补充"
            >
            </cube-input>
          </cube-form-item>
          <cube-form-item
            :field="fields[5]"
            class="form"
          >
            <cube-input
              v-model="userInfo.studentId"
              disabled
              placeholder="信息待补充"
            >
            </cube-input>
          </cube-form-item>
          <cube-form-item
            :field="fields[6]"
            class="form"
          >
            <cube-switch v-model="canEdit">
            </cube-switch>
          </cube-form-item>
          <cube-form-item
            :field="fields[7]"
            class="form"
          >
            <cube-switch v-model="toUpdatePwd">
            </cube-switch>
          </cube-form-item>
          <cube-form-item
            :field="fields[8]"
            class="form"
          >
            <cube-switch v-model="toUpdateStuInfo">
            </cube-switch>
          </cube-form-item>
        </cube-form-group>
      </cube-form>
      <div
        class="row-footer"
        style="display: flex; align-items: center;"
      >
        <cube-button
          :disabled="!canEdit"
          :primary="true"
          @click="save"
        >
          保存
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
      fields: [
        {
          type: 'input',
          label: '注册时间：',
        },
        {
          type: 'input',
          label: '用户名：',
        },
        {
          type: 'input',
          label: '注册邮箱：',
        },
        {
          type: 'input',
          label: '手机号：',
        },
        {
          type: 'input',
          label: '微信：',
        },
        {
          type: 'input',
          label: '教务账号：',
        },
        {
          type: 'input',
          label: '滑动编辑：',
        },
        {
          type: 'input',
          label: '修改密码：',
        },
        {
          type: 'input',
          label: '修改教务：',
        },
      ],
      canEdit: false, // 能否修改
      toUpdatePwd: false, // 修改密码
      toUpdateStuInfo: false, // 修改教务信息
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
          // 还原滑动开关
          this.toUpdatePwd = false;
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
        onCancel: () => {
          // 还原滑动开关
          this.toUpdatePwd = false;
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
          // 还原滑动开关
          this.toUpdateStuInfo = false;
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
        onCancel: () => {
          // 还原滑动开关
          this.toUpdateStuInfo = false;
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
      if (!this.canEdit) {
        return;
      }
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
          localStorage.removeItem('email');
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
  watch: {
    // 监听滑动开关变化，为true则跳出弹窗
    toUpdatePwd(newVal) {
      if (newVal) {
        this.updatePwd();
      }
    },
    toUpdateStuInfo(newVal) {
      if (newVal) {
        this.updateStuInfo();
      }
    },
  },
};

</script>

<style scoped>
#usercenter {
  height: 100%;
}
.row {
  margin: 0.4rem 0.625rem;
  border-radius: 0.2rem;
}
.form {
  margin: 0 0.625rem;
}
.row-input {
  width: 70%;
  float: right;
  margin: 0 0.1rem;
}
.row-footer {
  margin: 0.45rem 0.625rem;
}
</style>
