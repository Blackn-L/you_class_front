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

  // 获取验证码
  getCaptcha() {
    return axios({
      method: 'get',
      url: '/api/getcaptcha',
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
};
