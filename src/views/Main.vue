<template>
  <page title="课程表">
    <div
      slot="content"
      id="main"
    >
      <el-row style="font-size:16px; margin-top: 10px;">
        <el-col
          :span="2"
          style="margin: 5px 3px;"
        >3月</el-col>
        <el-col :span="21">
          <el-row>
            <el-col
              :span="4"
              style="background-color: DarkGray; margin: 5px 0px;"
              v-for="day in days"
              :key="day.key"
            >{{day.value}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row
        style="font-size:13px; margin-top: 10px;"
        v-for="(values, key, index) in classLists"
        :key=index
      >
        <div style="
              width:800px;height:1px;margin:0px
              auto;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
        <el-col
          :span="2"
          v-if="index === 0"
          style="margin: 5px 3px;"
        >一<br><br>08:00<br>┆<br>09:50</el-col>
        <el-col
          :span="2"
          v-if="index === 1"
          style=" margin: 5px 3px;"
        >二<br><br>10:10<br>┆<br>12:00</el-col>
        <el-col
          :span="2"
          v-if="index === 2"
          style=" margin: 5px 3px;"
        >三<br><br>13:30<br>┆<br>15:20</el-col>
        <el-col
          :span="2"
          v-if="index === 3"
          style=" margin: 5px 3px;"
        >四<br><br>15:30<br>┆<br>17:20</el-col>
        <el-col
          :span="2"
          v-if="index === 4"
          style=" margin: 5px 3px;"
        >五<br><br>18:30<br>┆<br>20:20</el-col>
        <el-col :span="21">
          <el-row>
            <el-col
              :span="4"
              v-for="(value, index) in values"
              :key="index"
              style=" margin: 5px 1px;"
            >
              <span style="max-width:100px;">
                <div
                  v-html="value[0]+'<br><br>'+value[1]"
                  v-if="value[1]"
                  inline
                >
                </div>
              </span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </page>
</template>

<script>
import api from '@/api/mainClass';
import Page from '@/components/Page.vue';

export default {
  components: {
    Page,
  },
  name: 'Main',

  data() {
    return {
      classLists: [], // 课程表信息
      leftIndex: [1, 2, 3, 4, 5],
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
      api.getClassList().then(({ data }) => {
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

<style>
#main {
  font-size: 16px;
}
</style>
