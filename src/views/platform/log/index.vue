<template>
  <a-row :gutter="16" class="screen-manage">
    <a-col class="gutter-row screen-manage" :span="24">
      <div class="main">
        <div class="right">
          <a-form-model layout="inline" :model="form">
            <a-form-model-item label="自动刷新" prop="auto">
              <a-radio-group v-model="form.auto" @change="handleChange">
                <a-radio :value="1">
                  是
                </a-radio>
                <a-radio :value="0">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-show="!form.auto">
              <a-button
                type="primary"
                :loading="loading"
                @click="handleGetData"
                >手动刷新</a-button
              >
            </a-form-model-item>
          </a-form-model>
          <div class="dirver">日志输出：</div>
          <div v-html="comboList" class="log-content"></div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>
export default {
  name: 'SystemLog',
  data() {
    return {
      loading: false,
      timer: '',
      form: {
        auto: 0
      },
      list: []
    }
  },
  computed: {
    comboList() {
      let str = ''
      this.list.forEach(item => {
        str += item + '</br>'
      })
      return str
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
    handleChange(e) {
      if (e.target.value) {
        this.handleGetData()
      } else {
        this.handleClearTimer()
      }
    },
    async handleGetData() {
      this.loading = true
      const result = await this.$server.log.getLogList().finally(() => {
        this.loading = false
      })

      if (result.code === 200) {
        this.list = [].concat(result.data)
        if (this.form.auto) {
          const time = 1000 * 10
          this.timer = setTimeout(() => {
            this.handleGetData()
          }, time)
        }
      } else {
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
    margin-bottom: 10px;
  }
  .log-content {
    border: 1px solid #e8e8e8;
    padding: 10px;
    line-height: 2;
    overflow-y: auto;
    word-break: keep-all;
    height: calc(100% - 84px);
    background-color: #f1f1f1;
  }
}
</style>
