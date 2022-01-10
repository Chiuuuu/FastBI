<template>
  <div class="record-layout">
    <div class="list-controller">
      <a-form-model layout="inline" :model="formData" ref="formData">
        <a-form-model-item label="标准地址编号" prop="resourceName">
          <a-input
            v-model="formData.resourceName"
            class="form-item"
            placeholder="请输入标准地址编号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="楼盘编号" prop="operateType">
          <a-input
            v-model="formData.operateType"
            class="form-item"
            placeholder="请输入楼盘编号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="修改字段" prop="content">
          <a-input
            v-model="formData.content"
            class="form-item"
            placeholder="请输入修改字段"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="操作者" prop="operator">
          <a-input
            v-model="formData.operator"
            class="form-item"
            placeholder="请输入操作者"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="账号" prop="userName">
          <a-input
            v-model="formData.userName"
            class="form-item"
            placeholder="请输入账号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="操作时间" prop="operationTime">
          <!-- <a-date-picker
            v-model="formData.operationTime"
            class="form-item"
            placeholder="请选择"
            valueFormat="YYYY-MM-DD"
          /> -->
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            v-model="formData.operationTime"
            class="form-item"
            valueFormat="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
          >
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="handleSearch" :disabled="loading"
            >查询</a-button
          >
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="default" @click="resetForm" :disabled="loading"
            >重置</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- 列表 -->
    <div class="list-table scrollbar">
      <a-table
        row-key="id"
        :columns="column"
        :data-source="dataList"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ y: 'calc(100vh - 420px)', x: 770 }"
        @change="handleTableChange"
      >
        <!-- 名称 -->
        <span slot="nameTitle">{{ dataName }}</span>
      </a-table>
    </div>
  </div>
</template>

<script>
import RecordMain from './record-main.vue'
import { trimFormData } from '@/utils/form-utils'
import omit from 'lodash/omit'

const column = [
  {
    title: '项目名称',
    ellipsis: true,
    dataIndex: 'projectName',
    width: 150
  },
  {
    title: '标准地址编号',
    ellipsis: true,
    dataIndex: 'resourceName',
    width: 180
  },
  {
    title: '楼盘编号',
    ellipsis: true,
    dataIndex: 'operateType',
    width: 180
  },
  {
    title: '修改字段',
    dataIndex: 'content',
    ellipsis: true,
    width: 220
  },
  {
    title: '操作时间',
    ellipsis: true,
    dataIndex: 'operationTime',
    width: 160
  },
  {
    title: '操作者',
    dataIndex: 'operator',
    ellipsis: true,
    width: 150
  },
  {
    title: '账号',
    dataIndex: 'userName',
    ellipsis: true,
    width: 120
  }
]
export default {
  name: 'recordArea',
  extends: RecordMain,
  data() {
    return {
      column,
      // 搜索
      formData: {
        resourceName: '', // 当前模块下对应 ->标准地址编号
        operateType: '', // 当前模块下对应 ->楼盘编号
        content: '',
        operator: '',
        userName: '',
        operationTime: []
      }
    }
  },
  methods: {
    handleSearch() {
      this.pagination.current = 1
      this.getList()
    },
    // 获取列表数据
    async getList(data = {}) {
      data.projectId !== undefined && (this.prjId = data.projectId)
      const params = Object.assign(
        {},
        omit(trimFormData(this.formData), 'operationTime'),
        {
          startTime:
            this.formData.operationTime.length > 0
              ? this.formData.operationTime[0] + ':00'
              : '',
          endTime:
            this.formData.operationTime.length > 0
              ? this.formData.operationTime[1] + ':59'
              : '',
          catalogType: this.type,
          projectId: this.prjId,
          pageNum: data.current ? data.current : this.pagination.current,
          pageSize: this.pagination.pageSize
        }
      )
      this.loading = true
      let res = await this.$server.systemManage.getOperaLogList(params)
      this.loading = false
      if (res.code !== 200) {
        this.$message.error(res.msg || '请重新操作')
        return
      }
      this.dataList = res.data.list || []
      this.pagination.total = res.data.total
    }
  }
}
</script>

<style scoped>

</style>
