import axios from 'axios';

export default {
  // 注册
  register(body) {
    return axios({
      method: 'post',
      url: '/api/register',
      data: body,
    });
  },

  // 登陆
  login(body) {
    return axios({
      method: 'post',
      url: '/api/login',
      data: body,
    });
  },

  // 获取图形验证码
  getCaptcha() {
    return axios({
      method: 'get',
      url: '/api/getCaptcha/verify',
    });
  },

  // 校验图形验证码
  checkCaptcha(code) {
    return axios({
      method: 'get',
      url: `api/getCaptcha/check/${code}`,
    });
  },

  // 发送邮箱验证码
  sendEmailCode(body) {
    return axios({
      method: 'post',
      url: '/api/getEmailCode',
      data: body,
    });
  },

  // 获取用户个人信息
  getUserInfo() {
    return axios({
      method: 'get',
      url: '/api/getUserInfo',
    });
  },

  // 修改个人信息
  saveUserInfo(body) {
    return axios({
      method: 'post',
      url: '/api/updateUserInfo',
      data: body,
    });
  },
  // 修改教务账号密码
  updateStuInfo(body) {
    return axios({
      method: 'post',
      url: '/api/updateStuInfo',
      data: body,
    });
  },
  // 校验密码是否正确
  checkPwd(body) {
    return axios({
      method: 'post',
      url: '/api/checkPwd',
      data: body,
    });
  },
  // 更新密码
  updatePwd(body) {
    return axios({
      method: 'post',
      url: '/api/updatePwd',
      data: body,
    });
  },
  // 登出
  loginOut() {
    return axios({
      method: 'get',
      url: '/api/loginOut',
    });
  },
  // 判断邮箱是否已经注册
  checkEmail(body) {
    return axios({
      method: 'post',
      url: '/api/checkEmail',
      data: body,
    });
  },
  // 判断邮箱验证码是否正确
  checkCode(body) {
    return axios({
      method: 'post',
      url: '/api/checkCode',
      data: body,
    });
  },
};
