import axios from 'axios';

export default {
  getMark(body) {
    return axios({
      method: 'post',
      url: `${this.apiStart}/api/getStuMark`,
      data: body,
    });
  },
};
