<template>
  <a-form-model class="oa-search" layout="inline" :model="searchForm">
    <a-form-model-item prop="name" label="大屏名称">
      <a-input v-model="searchForm.name" placeholder="请输入大屏名称"></a-input>
    </a-form-model-item>
    <a-form-model-item prop="createBy" label="发布者">
      <a-input v-model="searchForm.createBy" placeholder="请输入发布者"></a-input>
    </a-form-model-item>
    <a-form-model-item prop="status" label="当前状态">
      <a-select style="width: 200px" v-model="searchForm.status">
        <a-select-option value="">所有</a-select-option>
        <a-select-option :value="1">发布中</a-select-option>
        <a-select-option :value="2">已过期</a-select-option>
        <a-select-option :value="3">已撤销</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item prop="range" label="发布时间">
      <!-- <a-range-picker showTime @change="getDateRange" /> -->
      <a-range-picker v-model="range" showTime />
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="default" @click="handleReset" :loading="$parent.spinning">重置</a-button>
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSearch" :loading="$parent.spinning">查询</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import moment from 'moment'
export default {
  name: 'OASearch',
  props: {
    model: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    range: {
      get() {
        return [this.searchForm.startTime, this.searchForm.endTime]
      },
      set(value) {
        this.searchForm.startTime = value[0]
        this.searchForm.endTime = value[1]
      }
    }
  },
  data() {
    return {
      searchForm: {
        name: '',
        createBy: '',
        status: '',
        startTime: null,
        endTime: null
      }
    }
  },
  methods: {
    handleReset() {
      this.searchForm = this.$options.data().searchForm
      this.handleSearch()
    },
    handleSearch() {
      const form = {
        ...this.searchForm,
        startTime: this.searchForm.startTime ? moment(this.searchForm.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: this.searchForm.endTime ? moment(this.searchForm.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
      }
      this.$emit('search', form)
    }
  }
}
</script>

<style scoped>
.oa-search {
  padding: 10px 15px;
}
</style>
