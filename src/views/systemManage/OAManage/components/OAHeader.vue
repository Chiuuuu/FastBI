<template>
  <div class="oa-head">
    <h1>OA发布管理</h1>
    <div>
      <a-select
        style="width: 120px"
        show-search
        default-value=""
        :filter-option="filterOption"
        placeholder="请选择项目"
        @change="handleChange"
      >
        <a-select-option value="">
          所有项目
        </a-select-option>
        <a-select-option
          v-for="item in projectList"
          :key="item.projectId"
          :value="item.projectId"
          >{{ item.projectName }}</a-select-option
        >
      </a-select>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      projectList: []
    }
  },
  created() {
    this.getOperaLogProjectList()
  },
  methods: {
    // 获取项目列表
    async getOperaLogProjectList() {
      let res = await this.$server.systemManage.getOperaLogProjectList()
      if (res.code !== 200) {
        this.$message.error(res.msg || '项目列表获取不了')
        return
      }
      this.projectList = res.data
    },
    // 项目下拉框-搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleChange(val) {
      this.$emit('update:projectId', val)
    }
  }
}
</script>

<style lang="less" scoped>
.oa-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 15px 16px;
  border-bottom: 1px solid #efefef;
  h1 {
    color: #01040f;
    font-weight: bold;
    font-size: 16px;
    border-bottom: 0;
  }
}
</style>
