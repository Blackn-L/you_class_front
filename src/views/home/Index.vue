<template>
  <page>
    <div
      id="mainpage"
      slot="content"
    >
      <div class="headers">
        <div class="selects">
          <cube-select
            v-model="selectInfo.yearId"
            :options="yearList"
            style="width:3rem"
            placeholder="请选择学年"
          >
          </cube-select>
          <cube-select
            placeholder="请选择学期"
            v-model="selectInfo.termId"
            :options="termList"
          >
          </cube-select>
        </div>
        <cube-button
          class="search"
          :inline="true"
          :disabled="!canSearch"
          @click="onSearch"
          :primary="true"
        >查询</cube-button>
        <cube-button
          class="search"
          :inline="true"
          @click="toShowCredit"
          :primary="true"
        >查看修读进程</cube-button>
      </div>
      <div
        class="credit"
        v-if="showCredit"
      >

        <cube-input
          class="markLine"
          v-model="creditList[0].name"
          readonly
        >
          <p slot="append">{{creditList[0].count + '门'}}</p>
        </cube-input>
        <cube-input
          class="markLine"
          v-model="creditList[1].name"
          readonly
        >
          <p slot="append">{{creditList[1].count + '门'}}</p>
        </cube-input>
        <cube-input
          class="markLine"
          v-model="creditList[2].name"
          readonly
        >
          <p slot="append">{{creditList[2].count}}</p>
        </cube-input>
        <cube-input
          class="markLine"
          v-model="creditList[3].name"
          readonly
        >
        </cube-input>
        <cube-input
            style="font-size:0.35rem"
            v-for="(item, index) in creditList[3].count"
            :key="index"
            class="markLine"
            v-model="item.name"
            readonly
        >
        <span slot="prepend" style="font-size:0.35rem">{{ index + 1 + '、' }}</span>
         <p slot="append" style="font-size:0.35rem">{{item.count}}</p>
        </cube-input>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in markList"
          :key="index"
        >
          <cube-input
            v-if="item.name.length < 16"
            class="markLine"
            v-model="item.name"
            readonly
          ><span slot="prepend">{{ index + 1 + '、' }}</span>
            <p
              slot="append"
              v-if="item.mark !== ''"
            >{{item.mark}}</p>
            <p
              slot="append"
              v-else
              style="color:red;font-size:0.4rem"
            >不及格</p>
          </cube-input>
          <cube-input
            v-else
            style="font-size:0.30rem"
            class="markLine"
            v-model="item.name"
            readonly
          ><span slot="prepend">{{ index + 1 + '、' }}</span>
            <p
              slot="append"
              v-if="item.mark !== ''"
            >{{item.mark}}</p>
            <p
              slot="append"
              v-else
              style="color:red;font-size:0.4rem"
            >不及格</p>
          </cube-input>
        </div>
      </div>
    </div>
  </page>
</template>

<script>
import api from '@/api/home';
import Page from '@/components/Page.vue';

export default {
  components: {
    Page,
  },
  name: 'MainPage',

  data() {
    return {
      showCredit: false, // 是否显示课程修读进程
      yearTitle: '请选择学年',
      creditList: [],
      yearList: [
        {
          value: 35,
          text: '2015学年',
        },
        {
          value: 36,
          text: '2016学年',
        },
        {
          value: 37,
          text: '2017学年',
        },
        {
          value: 38,
          text: '2018学年',
        },
        {
          value: 39,
          text: '2019学年',
        },
      ],
      termList: [
        {
          value: 1,
          text: '春季学期',
        },
        {
          value: 2,
          text: '秋季学期',
        },
        {
          value: 3,
          text: '夏季学期',
        },
      ],
      selectInfo: {
        yearId: '',
        termId: '',
      },
      markList: [],
    };
  },
  computed: {
    canSearch() {
      return this.selectInfo.termId && this.selectInfo.yearId;
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.getMark();
      this.getCredit();
    },
    // 获取分数
    getMark() {
      const body = {
        termId: this.selectInfo.termId || '1',
        yearId: this.selectInfo.yearId || '38',
      };
      api.getMark(body).then(({ data }) => {
        if (data.Code === 200) {
          this.markList = data.Data;
          console.log(this.markList);
        } else {
          this.$createToast({
            type: 'warn',
            time: 2000,
            txt: data.Msg,
          }, false).show();
        }
      }).catch(e => console.log(e));
    },
    // 获取修读课程
    getCredit() {
      api.getCredit().then(({ data }) => {
        console.log(data);
        if (data.Code === 200) {
          console.log(data.Data);
          this.creditList = data.Data;
        } else {
          this.$createToast({
            type: 'warn',
            time: 2000,
            txt: '网络错误！',
          }, false).show();
        }
      });
    },
    // 点击查看修读进程按钮
    toShowCredit() {
      this.showCredit = !this.showCredit;
    },
    // 查询
    onSearch() {
      if (this.selectInfo.termId && this.selectInfo.yearId) {
        this.getMark();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.headers {
  display: flex;
  justify-content: space-between;
  .selects {
    display: flex;
    justify-content: start;
  }
  .search {
    // width: 2rem;
    display: flex;
    justify-content: space-around;
  }
}
.markLine {
  font-size: 0.45rem;
  span {
    font-size: 0.45rem;
    margin-left: 0.125rem;
  }
  p {
    margin-right: 1.125rem;
    font-size: 0.5rem;
    color: #007acc;
  }
}
.credit {
  margin-top: 0.625rem;
}
</style>
