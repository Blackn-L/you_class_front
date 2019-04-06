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
  // 获取课程成绩
  getMark(body) {
    return axios({
      method: 'post',
      url: '/api/getStuMark',
      data: body,
    });
  },
};
