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
      url: '/api/getcaptcha/verify',
    });
  },

  // 校验图形验证码
  checkCaptcha(code) {
    return axios({
      method: 'get',
      url: `api/getcaptcha/check/${code}`,
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
