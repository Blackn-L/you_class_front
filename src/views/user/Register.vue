<template>
  <div id="register">
    <div class="row-header">
      <cube-input
        v-model="email"
        placeholder="请输入邮箱"
      ></cube-input>
      <cube-validator
        v-model="emailValidator"
        :model="email"
        :rules="emailRule"
        :messages="emailMsg"
      >
      </cube-validator>
    </div>
    <div class="row">
      <cube-input
        v-model="username"
        placeholder="请输入用户名"
      ></cube-input>
      <cube-validator
        v-model="usernameValidator"
        :model="username"
        :rules="usernameRule"
        :messages="usernameMsg"
      >
      </cube-validator>
    </div>
    <div class="row">
      <cube-input
        v-model="password"
        placeholder="请输入密码"
      ></cube-input>
      <cube-validator
        v-model="passwordValidator"
        :model="password"
        :rules="passwordRule"
        :messages="passwordMsg"
      >
      </cube-validator>
    </div>
    <div class="row">
      <cube-input
        v-model="rPassword"
        placeholder="请再次输入密码"
      ></cube-input>
      <cube-validator
        v-model="rPasswordValidator"
        :model="rPassword"
        :rules="rPasswordRule"
        :messages="rPasswordMsg"
      >
      </cube-validator>
    </div>
    <div class="row">
      <cube-input
        v-model="code"
        placeholder="请输入验证码"
      ></cube-input>
      <cube-validator
        v-model="codeValidator"
        :model="code"
        :rules="codeRule"
        :messages="codeMsg"
      >
      </cube-validator>
    </div>
    <div class="row">
      <cube-input
        v-model="emailCode"
        placeholder="请输入邮箱验证码"
      ></cube-input>
      <cube-validator
        v-model="emailCodeValidator"
        :model="emailCode"
        :rules="emailCodeRule"
        :messages="emailCodeMsg"
      >
      </cube-validator>
    </div>
  </div>
</template>

<script>
import api from '@/api/user';

export default {
  name: 'register',
  data() {
    return {
      email: '', // 邮箱
      validators: [undefined, undefined, undefined, undefined], // 校验结果数组
      emailValidator: undefined, // 邮箱校验结果
      usernameValidator: undefined,
      passwordValidator: undefined,
      rPasswordValidator: undefined,
      codeValidator: undefined, // 图形验证码校验结果
      emailCodeValidator: undefined, // 邮箱验证码校验结果
      emailRule: {
        type: 'email',
        required: true,
        notWhitespace: true,
      },
      usernameRule: {
        required: true,
        min: 6,
        max: 25,
        notWhitespace: true,
        pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
      },
      passwordRule: {
        required: true,
        min: 8,
        max: 25,
        notWhitespace: true,
        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,25}$/,
      },
      rPasswordRule: {
        required: true,
        equal: val => val === this.password,
      },
      codeRule: {
        required: true,
        min: 4,
        max: 7,
      },
      emailCodeRule: {
        required: true,
        min: 4,
        max: 7, // 预先判断小于4大于7的都是错误的，防止不必要的访问开销
      },
      // 自定义消息提示
      emailMsg: {
        required: '邮箱不能为空！',
      },
      usernameMsg: {
        required: '用户名不能为空',
        min: '用户名至少为6位',
        max: '用户名不能超过25位',
        pattern: '只能输入中文，英文，数字以及下划线',
      },
      passwordMsg: {
        required: '密码不能为空',
        min: '密码至少为8位',
        max: '密码不能超过25位',
        pattern: '密码必须包含大小写字母和数字的组合，不能使用特殊字符',
      },
      rPasswordMsg: {
        required: '二次密码不能为空',
        equal: '两次密码不一致',
      },
      codeMsg: {
        required: '图形验证码不能为空',
        isFalse: '图形验证码错误',
        min: '图形验证码错误',
        max: '图形验证码错误',
      },
      emailCodeMsg: {
        required: '邮箱验证码不能为空',
        isFalse: '邮箱验证码错误',
        min: '图形验证码错误',
        max: '图形验证码错误',
      },
      emailError: '', // 邮箱错误提示信息
      emailTrue: false, // 邮箱正确
      username: '', // 用户名
      usernameError: '', // 用户名错误提示信息
      usernameTrue: false,
      password: '', // 密码
      passwordError: '', // 密码错误提示信息
      passwordTrue: false,
      rPassword: '', // 重复输入密码
      rPasswordError: '',
      rPasswordTrue: false,
      code: '', // 验证码
      emailCode: '', // 邮箱验证码
      submitFlag: false, // 是否是提交时执行的
      emailCodeLoding: false, // 邮箱验证码按钮是否显示loading
      emailButtonName: '发送验证码', // 邮箱验证码发送按钮名称
    };
  },
  methods: {
    // 提交
    submit() {
      this.submitFlag = true;
      this.checkForm();
      if (!(this.emailTrue && this.usernameTrue && this.passwordTrue && this.rPasswordTrue)) {
        this.$toast('klll');
        return false;
      }
      this.$toast('交');
      this.removeSpaces();
      // 判断验证码是否正确,这里先不写
      const body = {
        email: this.email,
        username: this.username,
        password: this.password,
      };
      this.$toast('进行提交');
      api.register(body).then((response) => {
        console.log(response);
      });
      this.$toast('注册成功');
      return true;
    },

    // 去除空格
    removeSpaces() {
      this.email = this.email.trim();
      this.username = this.username.trim();
      this.password = this.password.trim();
      this.rPassword = this.rPassword.trim();
      this.code = this.code.trim();
    },


    // 获取验证码
    getCaptcha() {
      const tmp = Math.random(); // 生成随机数，防止缓存不能刷新图片
      this.codeSrc = `http://jw.tt/api/getcaptcha/${tmp}`;
    },

    // 发送邮箱验证码
    sendEmailCode() {
      if (!this.validEmail()) {
        return false;
      }
      this.emailCodeLoding = true;
      api.sendEmailCode().then(({ data }) => {
        if (data.Code === 200) {
          this.$notify({
            message: '发送成功',
            duration: 1000,
            background: '#1989fa',
          });
        } else {
          this.$notify(data.Msg);
        }
      });
      this.emailCodeLoding = false;
      return true;
      // 实现倒计时功能
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
</style>
