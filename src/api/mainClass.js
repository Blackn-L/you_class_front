import axios from 'axios';

export default {
  // 获取课程表列表
  getClassList(body) {
    return axios({
      method: 'post',
      url: '/api/getClassList',
      data: body,
    });
  },
};
