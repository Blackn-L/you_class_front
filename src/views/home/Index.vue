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
      </div>
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
    //   canSearch: false,
      yearTitle: '请选择学年',
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
    width: 2rem;
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
</style>
