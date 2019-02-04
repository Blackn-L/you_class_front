<template>
  <div id="register">
    <div class="row-header">
      <cube-input
        v-model="formItem.email"
        placeholder="请输入注册邮箱"
      ></cube-input>
      <cube-validator
        v-model="validators.emailValidator"
        :model="formItem.email"
        :rules="validateRules.emailRule"
        :messages="errorMsgs.emailMsg"
      >
      </cube-validator>
    </div>

    <div class="row">
      <cube-input
        v-model="formItem.password"
        type="password"
        :eye="{ open: false, reverse: false }"
        :maxlength=25
        placeholder="请输入密码"
      ></cube-input>
      <cube-validator
        ref="passwordValidate"
        v-model="validators.passwordValidator"
        :model="formItem.password"
        :rules="validateRules.passwordRule"
        :messages="errorMsgs.passwordMsg"
      >
      </cube-validator>
    </div>
    <div class="row">
      <div style="display: flex; align-items: center;">
        <cube-input
          style="width: 50%; margin-right: 2%;"
          v-model="formItem.code"
          :maxlength="5"
          placeholder="请输入验证码"
        >
        </cube-input>
        <img
          :src="codeImgUrl"
          alt="验证码"
          style="width: 49%; height:auto"
          @click="getCaptcha"
        >
      </div>

      <cube-validator
        v-model="validators.codeValidator"
        :model="formItem.code"
        :rules="validateRules.codeRule"
        :messages="errorMsgs.codeMsg"
      >
      </cube-validator>
    </div>
    <div class="row-submit">
      <cube-button
        type="submit"
        @click="submit"
      >
        登陆
      </cube-button>
    </div>

  </div>
</template>

<script>
import api from '@/api/user';

export default {
  name: 'Login',
  data() {
    return {
      codeImgUrl: null, // 验证码URL
      formItem: {
        email: '', // 邮箱
        password: '', // 密码
        code: '', // 图形验证码
      },
      // 验证结果
      validators: {
        emailValidator: undefined,
        passwordValidator: undefined,
        codeValidator: undefined, // 图形验证码
      },
      // 验证规则
      validateRules: {
        emailRule: {
          type: 'email',
          required: true,
          notWhitespace: true,
        },
        passwordRule: {
          required: true,
          min: 8,
          max: 25,
          notWhitespace: true,
          pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{8,25}$/,
        },
        codeRule: {
          required: true,
          notWhitespace: true,
        },
      },
      // 自定义消息提示
      errorMsgs: {
        emailMsg: {
          required: '邮箱不能为空！',
        },
        passwordMsg: {
          required: '密码不能为空',
          min: '密码输入错误',
          max: '密码不能超过25位',
          notWhitespace: '密码不能为空',
          pattern: '密码输入错误',
        },
        codeMsg: {
          required: '图形验证码不能为空',
          notWhitespace: '图形验证码不能为空',
        },
      },
    };
  },
  methods: {
    // 获取图形验证码
    getCaptcha() {
      const tmp = Math.random(); // 生成随机数，防止缓存不能刷新图片
      this.codeImgUrl = `/api/getcaptcha/verify/${tmp}`;
    },
    // 校验邮箱、用户名、验证码
    checkAll() {
      const tmp = this.validators;
      // eslint-disable-next-line max-len
      const flag = tmp.emailValidator && tmp.passwordValidator && tmp.codeValidator;
      if (!flag) {
        const toast = this.$createToast({
          txt: '请填写正确',
          type: 'error',
        });
        toast.show();
        return false;
      }
      return true;
    },
    // 提交
    submit() {
      if (!this.checkAll()) {
        return false;
      }
      const body = {
        email: this.formItem.email,
        password: this.formItem.password,
        code: this.formItem.code,
      };
      api.login(body).then(({ data }) => {
        if (data.Code === 200) {
          this.$createToast({
            txt: '登陆成功',
            type: 'success',
          }).show();
          this.$router.push({
            name: 'user_center',
          });
        } else {
          this.$createToast({
            txt: data.Msg,
            type: 'error',
          }).show();
        }
        this.getCaptcha();
      }).catch((e) => {
        console.log(e);
      });
      return true;
    },
  },
  created() {
    this.getCaptcha();
  },
  computed: {

  },
};
</script>
<style lang="less" scoped>
.row {
  margin: 0.4rem 0.625rem;
}
.row-header {
  margin: 0.625rem 0.625rem 0.4rem;
}
.row-submit {
  margin: 1rem 0.625rem 0.4rem;
}
</style>
