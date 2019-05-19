import axios from 'axios';

export default {
  getMark(body) {
    return axios({
      method: 'post',
      url: 'api/getStuMark',
      data: body,
    });
  },
  getCredit() {
    return axios({
      method: 'get',
      url: 'api/getCredit',
    });
  },
};
