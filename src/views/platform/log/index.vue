<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <div class="main">
        <div class="right">
          <a-form-model layout="inline" :model="form">
            <a-form-model-item label="自动刷新" prop="auto">
              <a-radio-group v-model="form.auto" @change="handleChange">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-show="!form.auto">
              <a-button type="primary" :loading="loading" @click="handleGetData">手动刷新</a-button>
            </a-form-model-item>
          </a-form-model>
          <div class="dirver">
            <span>当前输出日志：{{ currentDate }}</span>
            <div>
              <a-button type="primary" style="margin-right:20px" @click="handleSwitchDate('prev')">上一天</a-button>
              <a-button type="primary" @click="handleSwitchDate('next')" :disabled="disabledNextDay">下一天</a-button>
            </div>
          </div>
          <div v-html="comboList" class="log-content"></div>
          <div class="list-pagination">
            <a-pagination
              showQuickJumper
              :current="pagination.current"
              :total="pagination.total"
              :pageSize="1"
              @change="handlePageChange"
            ></a-pagination>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import moment from 'moment'
export default {
  name: 'SystemLog',
  data() {
    return {
      loading: false,
      timer: '',
      form: {
        auto: 0
      },
      pagination: {
        current: 1,
        total: 0
      },
      currentDate: moment().format('YYYY-MM-DD'),
      list: []
    }
  },
  computed: {
    comboList() {
      let str = ''
      this.list.forEach((item) => {
        str += item + '</br>'
      })
      return str
    },
    disabledNextDay() { // 是否禁用下一天按钮
      const nextDay = moment(this.currentDate).add(1, 'days').format('YYYY-MM-DD')
      return +new Date(nextDay) > +new Date()
    }
  },
  mounted() {
    this.handleGetData()
  },
  beforeDestroy() {
    this.handleClearTimer()
  },
  methods: {
    handleClearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = ''
      }
    },
    // 点击上一天下一天
    handleSwitchDate(type) {
      let day
      if (type === 'prev') {
        day = -1
      } else if (type === 'next') {
        day = 1
      }
      this.currentDate = moment(this.currentDate).add(day, 'days').format('YYYY-MM-DD')
      this.handleGetData()
    },
    handlePageChange(page, pageSize) {
      Object.assign(this.pagination, {
        current: page
      })
      this.$nextTick(() => {
        this.handleGetData()
      })
    },
    handleChange(e) {
      if (e.target.value) {
        this.handleGetData()
      } else {
        this.handleClearTimer()
      }
    },
    async handleGetData() {
      this.loading = true
      const result = await this.$server.log.getLogList({
        date: this.currentDate,
        current: this.pagination.current
      }).finally(() => {
        this.loading = false
      })

      if (result.code === 200) {
        this.list = [].concat(result.rows)
        this.pagination.total = result.total
        if (this.form.auto) {
          const time = 1000 * 10
          this.timer = setTimeout(() => {
            this.handleGetData()
          }, time)
        }
      } else {
        this.list = []
        this.pagination.total = 0
        this.handleClearTimer()
        this.$message.error(result.msg || '请求错误')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  position: relative;
  height: 100%;
  background-color: #ffffff;
  color: #01040f;
  padding: 10px 20px;
  .right {
    height: 100%;
  }
  .dirver {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .log-content {
    border: 1px solid #e8e8e8;
    padding: 10px;
    line-height: 2;
    overflow-y: auto;
    word-break: keep-all;
    height: calc(100% - 134px);
    background-color: #f1f1f1;
  }
  .list-pagination {
    width: 100%;
    height: 32px;
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
