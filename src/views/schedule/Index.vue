<template>
  <page>
    <div
      slot="content"
      id="main"
    >
      <el-row
        type='flex'
        align="middle"
        justify="space-between"
      >
        <el-col :span="2">3月</el-col>
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
        // {
        //   key: 'SUN',
        //   value: '周天',
        // },
      ],
      errorToast: this.$createToast({
        type: 'warn',
        time: 2000,
        txt: '网络错误！',
      }, false), // api请求，网络错误提示
    };
  },
  methods: {
    getClassList() {
      const body = {
        // 16年球季学期
        yearId: '36',
        termId: '2',
      };

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
    },
  },
  created() {
    this.getClassList();
  },
};
</script>

<style lang="less" scoped>
#main {
  font-size: 16px;
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
    margin: 7px 5px 2px 2px;
    font-size: 14px;
    .courseName {
      color: black;
    }
    .classroom {
      color: #0c5586;
    }
  }
}
</style>
