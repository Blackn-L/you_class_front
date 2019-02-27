<template>
  <div id="register">
    <div class="row-header">
      <cube-input
        v-model="formItem.email"
        placeholder="请输入邮箱"
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
        v-model="formItem.username"
        placeholder="请输入用户名"
        :maxlength=25
      ></cube-input>
      <cube-validator
        ref="userValidate"
        v-model="validators.usernameValidator"
        :model="formItem.username"
        :rules="validateRules.usernameRule"
        :messages="errorMsgs.usernameMsg"
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
      <cube-input
        v-model="formItem.rPassword"
        type="password"
        :eye="{ open: false, reverse: false }"
        :maxlength="25"
        placeholder="请再次输入密码"
      ></cube-input>
      <cube-validator
        ref="rPasswordValidate"
        v-model="validators.rPasswordValidator"
        :model="formItem.rPassword"
        :rules="validateRules.rPasswordRule"
        :messages="errorMsgs.rPasswordMsg"
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
    <div class="row">
      <cube-input
        v-model="formItem.emailCode"
        placeholder="请输入邮箱验证码"
      >
        <cube-button
          slot="append"
          :inline="true"
          :primary="true"
          :disabled="emailCodeLoding"
          @click="sendEmailCode"
        >
          {{emailCodeText}}
        </cube-button>
      </cube-input>
      <cube-validator
        v-model="validators.emailCodeValidator"
        :model="formItem.emailCode"
        :rules="validateRules.emailCodeRule"
        :messages="errorMsgs.emailCodeMsg"
      >
      </cube-validator>
    </div>
    <div class="row-submit">
      <cube-button
        type="submit"
        @click="submit"
      >
        注册
      </cube-button>
    </div>

  </div>
</template>

<script>
import api from '@/api/user';

export default {
  name: 'register',
  data() {
    return {
      formItem: {
        email: '', // 邮箱
        username: '', // 用户名
        password: '', // 密码
        rPassword: '', // 重复输入密码
        code: '', // 图形验证码
        emailCode: '', // 邮箱验证码
      },
      // 验证结果
      validators: {
        emailValidator: undefined,
        usernameValidator: undefined,
        passwordValidator: undefined,
        rPasswordValidator: undefined,
        codeValidator: undefined, // 图形验证码
        emailCodeValidator: undefined, // 邮箱验证码
      },
      // 验证规则
      validateRules: {
        emailRule: {
          type: 'email',
          required: true,
          notWhitespace: true,
        },
        usernameRule: {
          required: true,
          min: 3,
          max: 25,
          notWhitespace: true,
          pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
        },
        passwordRule: {
          required: true,
          min: 8,
          max: 25,
          notWhitespace: true,
          pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{8,25}$/,
        },
        rPasswordRule: {
          required: true,
          equal: val => val === this.formItem.password,
        },
        codeRule: {
          required: true,
          notWhitespace: true,
        },
        emailCodeRule: {
          required: true,
          min: 4,
          max: 7, // 预先判断小于4大于7的都是错误的，防止不必要的访问开销
          notWhitespace: true,
        },
      },
      // 自定义消息提示
      errorMsgs: {
        emailMsg: {
          required: '邮箱不能为空！',
        },
        usernameMsg: {
          required: '用户名不能为空',
          notWhitespace: '用户名不能为空',
          min: '用户名至少为3位',
          max: '用户名不能超过25位',
          pattern: '只能输入中文，英文，数字以及下划线',
        },
        passwordMsg: {
          required: '密码不能为空',
          min: '密码至少为8位',
          max: '密码不能超过25位',
          notWhitespace: '密码不能为空',
          pattern: '密码必须包含字母和数字，不能使用特殊字符',
        },
        rPasswordMsg: {
          required: '二次密码不能为空',
          equal: '两次密码不一致',
        },
        codeMsg: {
          required: '图形验证码不能为空',
          notWhitespace: '图形验证码不能为空',
        },
        emailCodeMsg: {
          required: '邮箱验证码不能为空',
          notWhitespace: '邮箱验证码不不能为空',
          min: '邮箱验证码错误',
          max: '邮箱验证码错误',
        },
      },
      codeImgUrl: null,
      emailCodeText: '发送验证码',
      emailCodeLoding: false, // 邮箱验证码按钮是否显示loading
    };
  },
  methods: {
    // 获取图形验证码
    getCaptcha() {
      const tmp = Math.random(); // 生成随机数，防止缓存不能刷新图片
      this.codeImgUrl = `/api/getcaptcha/verify/${tmp}`;
    },
    // 发送邮箱验证码
    sendEmailCode() {
      if (!this.checkAll()) {
        return false;
      }
      const toast = this.$createToast({
        txt: '图形验证码错误',
        type: 'error',
      });
      // eslint-disable-next-line max-len
      if (!this.formItem.code || !this.validators.codeValidator || this.formItem.code.length !== 5) {
        toast.show();
        return false;
      }
      api.checkCaptcha(this.formItem.code).then((respones) => {
        if (respones.data.Code === 200) {
          this.emailCodeLoding = true;
          api.sendEmailCode().then(({ data }) => {
            if (data.Code === 200) {
              this.$createToast({
                txt: '发送成功',
                type: 'correct',
              }).show();
            } else {
              this.$createToast({
                txt: '发送失败',
                type: 'error',
              }).show();
            }
          }).catch((e) => {
            this.$createToast({
              txt: '网络错误',
              type: 'error',
            }).show();
            console.log(e);
          });
          const wait = 60;
          this.countDown(wait);
        } else {
          this.getCaptcha();
          toast.show();
          return false;
        }
        return true;
      });
      return true;
    },
    // 倒计时60s
    countDown(wait) {
      if (wait === 0) {
        this.emailCodeText = '发送验证码';
        this.emailCodeLoding = false;
      } else {
        this.emailCodeText = `${wait}秒后再次发送`;
        // eslint-disable-next-line no-param-reassign
        wait -= 1;
        setTimeout(() => {
          this.countDown(wait);
        }, 1000);
      }
      return true;
    },
    // 校验邮箱、用户名、密码是否正确
    checkAll() {
      const tmp = this.validators;
      // eslint-disable-next-line max-len
      const flag = tmp.emailValidator && tmp.usernameValidator && tmp.passwordValidator && tmp.rPasswordValidator;
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
    // 校验邮箱验证码是否正确
    checkEmailCode() {
      console.log('校验');
    },
    // 提交
    submit() {
      if (!this.checkAll()) {
        return false;
      }
      const body = {
        email: this.formItem.email,
        username: this.formItem.username,
        password: this.formItem.password,
        emailCode: this.formItem.emailCode,
      };
      api.register(body).then(({ data }) => {
        if (data.Code === 200) {
          this.$createToast({
            txt: '注册成功',
            type: 'success',
          }).show();
        } else {
          this.$createToast({
            txt: data.Msg,
            type: 'error',
          }).show();
        }
        this.getCaptcha();
      }).catch((e) => {
        this.$createToast({
          txt: '网络错误',
          type: 'error',
        }).show();
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
