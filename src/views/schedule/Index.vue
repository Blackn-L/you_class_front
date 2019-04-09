<template>
  <page>
    <div
      slot="content"
      id="main"
    >
      <div class="header">
        <a @click="lastTerm">上一学期</a>
        <span>{{termTitle}}</span>
        <a @click="nextTerm">下一学期</a>
      </div>
      <el-row
        type='flex'
        align="middle"
        justify="space-between"
      >
        <el-col :span="2">{{ curretnMonth }}</el-col>
        <el-col :span="21">
          <el-row>
            <el-col
              :span="4"
              style="background-color: DarkGray;"
              v-for="day in days"
              :key="day.key"
            >{{day.value}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <cube-loading
        :size="48"
        v-show='loading'
      ></cube-loading>
      <div
        class="rows"
        v-for="item in list"
        :key="item.session"
      >
        <div class="line"></div>
        <el-row
          class="inRow"
          type='flex'
          align="middle"
          justify="space-between"
        >
          <el-col :span="2">{{ item.label }}</el-col>
          <el-col
            :span="3"
            v-for="(day, index) in classLists"
            :key="index"
          >
            <p class="courseName">{{day[item.session][0]}}</p>
            <br>
            <div class="weeks">
              <p v-if="day[item.session][3] && !day[item.session][4]">{{day[item.session][3]}}</p>
              <p v-if="day[item.session][4]">{{day[item.session][4]}}</p>
            </div>
            <span
              v-if="day[item.session][1]"
              class="classroom"
            >{{day[item.session][1]}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </page>
</template>

<script>
import api from '@/api/schedule';
import Page from '@/components/Page.vue';

export default {
  components: {
    Page,
  },
  name: 'Main',

  data() {
    return {
      loading: true,
      currentTime: {
        year: '',
        month: '',
      },
      termInfo: {
        yearId: '39', // 学年 当前年份+20
        termId: '1', // 学期
      },
      list: [
        {
          session: 'First',
          label: '①',
        },
        {
          session: 'Second',
          label: '②',
        },
        {
          session: 'Third',
          label: '③',
        },
        {
          session: 'Fourth',
          label: '④',
        },
        {
          session: 'Fifth',
          label: '⑤',
        },
      ],
      classLists: [], // 课程表信息
      days: [
        {
          key: 'MON',
          value: '周一',
        },
        {
          key: 'TUE',
          value: '周二',
        },
        {
          key: 'WED',
          value: '周三',
        },
        {
          key: 'THU',
          value: '周四',
        },
        {
          key: 'FRI',
          value: '周五',
        },
        {
          key: 'SAT',
          value: '周六',
        },
      ],
      errorToast: this.$createToast({
        type: 'warn',
        time: 2000,
        txt: '网络错误！',
      }, false), // api请求，网络错误提示
    };
  },
  computed: {
    curretnMonth() {
      const date = new Date();
      return `${date.getMonth() + 1}月`;
    },
    termTitle() {
      let name = '';
      switch (this.termInfo.termId) {
        case '1':
          name = '春季学期';
          break;
        case '2':
          name = '秋季学期';
          break;
        case '3':
          name = '夏季学期';
          break;
        default:
          name = '秋季学期';
      }
      const title = `20${this.termInfo.yearId - 20}年${name}`;
      return title;
    },
  },
  methods: {
    getClassList() {
      const body = this.termInfo;
      api.getClassList(body).then(({ data }) => {
        if (data.Code === 200) {
          console.log(data.Data);
          this.classLists = data.Data;
        } else {
          this.$createToast({
            type: 'warn',
            time: 2000,
            txt: data.Msg,
          }, false).show();
          // 300为未登陆
          if (data.Code === 300) {
            setTimeout(() => {
              this.$router.push({
                name: 'account',
                params: 'login',
              });
            }, 1000);
          }
        }
      }).catch((e) => {
        this.errorToast.show();
        console.log(e);
      });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    // 计算当前学期
    checkTerm() {
      const curDate = new Date();
      const year = curDate.getFullYear();
      const month = curDate.getMonth() + 1;
      let termId = '1';
      if (month >= 2 && month <= 7) {
        termId = '1';
      } else if (month === 8) {
        termId = '3';
      } else {
        termId = '2';
      }
      this.currentTime.year = year;
      this.currentTime.month = month;
      this.currentTime.term = termId;
      this.termInfo.termId = termId;
      this.termInfo.yearId = year - 2000 + 20;
    },
    // 上一学期
    lastTerm() {
      // 无法查看更入学前的课表，没有啊！
      if (this.termInfo.yearId + 4 <= this.currentTime.year - 1980) {
        this.$createToast({
          type: 'warn',
          time: 4000,
          txt: '那会你还没上大学呢！',
        }, false).show();
        return;
      }
      if (`${this.termInfo.termId}` === '1') {
        this.termInfo.yearId = this.termInfo.yearId - 1;
        this.termInfo.termId = '2';
      } else if (`${this.termInfo.termId}` === '2') {
        this.termInfo.termId = '3';
      } else if (`${this.termInfo.termId}` === '3') {
        this.termInfo.termId = '1';
      }
      this.loading = true;
      this.getClassList();
    },
    // 下一学期
    nextTerm() {
      // 如果显示的课表时间是本学期时间，那么就不能再查看下学期课表
      if (this.termInfo.yearId >= this.currentTime.year - 1980 && `${this.termInfo.termId}` === `${this.currentTime.term}`) {
        this.$createToast({
          type: 'warn',
          time: 4000,
          txt: '下学期课表谁都不知道！',
        }, false).show();
        return;
      }
      if (`${this.termInfo.termId}` === '1') {
        this.termInfo.termId = '3';
      } else if (`${this.termInfo.termId}` === '2') {
        this.termInfo.yearId = this.termInfo.yearId - 0 + 1;
        this.termInfo.termId = '1';
      } else if (`${this.termInfo.termId}` === '3') {
        this.termInfo.termId = '2';
      }
      this.loading = true;
      this.getClassList();
    },
  },
  created() {
    this.checkTerm();
    this.getClassList();
  },
};
</script>

<style lang="less" scoped>
#main {
  font-size: 16px;
}
.header {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 0.625rem;
  width: 100%;
}
.line {
  width: 100%;
  height: 1px;
  margin: 0px auto;
  padding: 0px;
  background-color: #d5d5d5;
  overflow: hidden;
}
.rows {
  margin: 2px 5px;
  .inRow {
    margin: 3px 5px 2px 2px;
    font-size: 14px;
    .courseName {
      color: black;
    }
    .weeks {
      margin-top: 2px;
      p {
        color: #85312f;
      }
    }
    .classroom {
      margin-top: 4px;
      color: #0c5586;
    }
  }
}
</style>
