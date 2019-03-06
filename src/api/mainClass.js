import axios from 'axios';

export default {
  // 获取课程表列表
  getClassList() {
    return axios({
      method: 'get',
      url: '/api/getClassList',
    });
  },
};
