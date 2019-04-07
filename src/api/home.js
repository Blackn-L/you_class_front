import axios from 'axios';

export default {
  getMark(body) {
    return axios({
      method: 'post',
      url: 'api/getStuMark',
      data: body,
    });
  },
};
