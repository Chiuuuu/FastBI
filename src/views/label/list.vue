<template>
  <div class="main main-padding main-bg scrollbar">
    <a-row type="flex" justify="space-between" style="margin-bottom:10px">
      <a-col><a-button type="primary" @click="handleOpenModal('LabelForm')">新建</a-button></a-col>
      <a-col><a-button type="primary" @click="handleOpenModal('ExamLog')">标签审核日志</a-button></a-col>
    </a-row>
    <a-row type="flex" justify="space-between">
      <a-col>
        <a-form-model ref="form" layout="inline" :model="searchForm">
          <a-form-model-item label="关键字" prop="searchWord">
            <a-input
              placeholder="标签名称/描述/创建人/修改人"
              v-model="searchForm.searchWord"
              style="width: 240px"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="标签状态" prop="status">
            <a-tree-select
              v-model="searchForm.searchStatus"
              style="width: 240px"
              :tree-data="treeData"
              placeholder="标签状态"
              treeNodeFilterProp="title"
              allow-clear
              tree-checkable
              treeDefaultExpandAll
            />
          </a-form-model-item>
          <a-form-model-item label="创建日期" prop="gmtCreate">
            <a-range-picker
              style="width: 240px"
              v-model="searchForm.gmtCreate"
              format="YYYY-MM-DD"
            />
          </a-form-model-item>
          <a-form-model-item label="修改日期" prop="gmtModified">
            <a-range-picker
              style="width: 240px"
              v-model="searchForm.gmtModified"
              format="YYYY-MM-DD"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="handleGetData">查询</a-button>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="default" @click="handleResetForm">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>

    <a-table
      rowKey="id"
      :loading="listLoading"
      :columns="listColumn"
      :data-source="listData"
      :pagination="false"
      :scroll="{ x: 1620, y: 'calc(100vh - 320px)' }"
      >
      <template #status="list, record">
        <span v-if="record.status === 1" style="color:#617BFF">待审核</span>
        <span v-else-if="record.status === 2" style="color:#4B7902">已上线</span>
        <span v-else-if="record.status === 3" style="color:#D9001B">驳回</span>
        <span v-else-if="record.status === 4" style="color:#AAA">已下线</span>
        <span v-else></span>
      </template>
      <template #check="list, record">
        <a style="margin-right: 10px" @click="handleOpenModal('VersionLog', record)">版本记录</a>
        <a @click="handleOpenModal('CommentLog', record)">评估记录</a>
      </template>
      <template #config="list, record">
        <a v-if="record.status !== 2" @click="handleOpenModal('ExamForm', record)">审批</a>
        <a-popconfirm
          v-else-if="record.status === 2"
          title="是否确定下线？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleCloseLabel(record)"
        >
          <a>下线</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="handleOpenModal('CommentForm', record)">评估</a>
        <a-divider type="vertical" />
        <a @click="handleOpenModal('LabelForm', record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="是否确定删除？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDelete(record)"
        >
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <div class="list-pagination">
      <a-pagination
        showQuickJumper
        showSizeChanger
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        :show-total="total => `共${total}条记录`"
        @change="handlePageChange"
        @showSizeChange="handleSizeChange"
      ></a-pagination>
    </div>

    <component
      :is="component.name"
      :row-data="component.data"
      :visible="component.visible"
      @close="handleCloseModal"
      @refresh="handleRefreshList"
    />
  </div>
</template>

<script>
import paginationMixin from './mixins/pagination'

import ExamLog from './components/examLog'
import CommentLog from './components/commentLog'
import VersionLog from './components/versionLog'

import LabelForm from './components/labelForm'
import CommentForm from './components/commentForm'
import ExamForm from './components/examForm'

const listColumn = [
  {
    title: '标签名称',
    width: 200,
    ellipsis: true,
    dataIndex: 'name'
  },
  {
    title: '标签描述',
    dataIndex: 'description',
    width: 250,
    ellipsis: true
  },
  {
    title: '版本号',
    dataIndex: 'userVersion',
    width: 100,
    ellipsis: true
  },
  {
    title: '创建人',
    width: 130,
    ellipsis: true,
    dataIndex: 'creUserName'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: 180,
    ellipsis: true
  },
  {
    title: '修改人',
    width: 130,
    ellipsis: true,
    dataIndex: 'modUserName'
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
    width: 180,
    ellipsis: true
  },
  {
    title: '标签状态',
    fixed: 'right',
    dataIndex: 'status',
    width: 90,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '查看',
    fixed: 'right',
    dataIndex: 'check',
    width: 160,
    scopedSlots: { customRender: 'check' }
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'config',
    width: 200,
    scopedSlots: { customRender: 'config' }
  }
]
const treeData = [
  {
    title: '全选',
    value: '0',
    key: '0',
    children: [
      {
        title: '待审核',
        value: '1',
        key: '1'
      },
      {
        title: '驳回',
        value: '3',
        key: '3'
      },
      {
        title: '已上线',
        value: '2',
        key: '2'
      },
      {
        title: '已下线',
        value: '4',
        key: '4'
      }
    ]
  }
]
export default {
  name: 'list',
  mixins: [paginationMixin],
  components: {
    ExamLog,
    CommentLog,
    VersionLog,
    LabelForm,
    CommentForm,
    ExamForm
  },
  data() {
    return {
      component: {
        name: '',
        visible: false,
        data: {}
      }, // 动态组件信息
      searchForm: {
        searchWord: '',
        searchStatus: [],
        gmtCreate: [],
        gmtModified: []
      },
      treeData, // 标签状态树形结构
      listLoading: false,
      listColumn,
      listData: []
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    // 重置表单
    handleResetForm() {
      this.searchForm = this.$options.data().searchForm
      this.$refs.form && this.$refs.form.resetFields()
      this.$nextTick(() => {
        this.handleRefreshList()
      })
    },
    // 刷新列表
    handleRefreshList() {
      this.pagination = this.$options.data().pagination
      this.$nextTick(() => {
        this.handleGetData()
      })
    },
    // 关闭弹窗
    handleCloseModal() {
      this.component = {
        name: '',
        visible: false,
        data: {}
      }
    },
    // 打开弹窗
    handleOpenModal(name, data) {
      if (name === 'ExamForm' && data.status !== 1) {
        return this.$message.error('当前状态无法审核')
      }
      this.component = Object.assign({}, {
        name: name,
        visible: true,
        data: data || {}
      })
    },
    // 下线/关闭标签
    async handleCloseLabel({ id, version }) {
      const result = await this.$server.label.actionCloseLabel({ id, version })
      if (result.code === 200) {
        this.$message.success('下线成功')
        this.handleRefreshList()
      } else {
        this.$message.error(result.msg)
      }
    },
    // 删除标签
    async handleDelete({ id, version }) {
      const result = await this.$server.label.deleLabel({ id, version })
      if (result.code === 200) {
        this.$message.success('删除成功')
        this.handleRefreshList()
      } else {
        this.$message.error(result.msg)
      }
    },
    async handleGetData() {
      this.listLoading = true

      const params = {
        searchWord: this.searchForm.searchWord,
        searchStatus: this.searchForm.searchStatus,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      const gmtCreate = this.searchForm.gmtCreate
      if (gmtCreate.length > 0) {
        params.creStart = gmtCreate[0].format('YYYY-MM-DD')
        params.creEnd = gmtCreate[1].format('YYYY-MM-DD')
      }
      const gmtModified = this.searchForm.gmtModified
      if (gmtModified.length > 0) {
        params.modStart = gmtModified[0].format('YYYY-MM-DD')
        params.modEnd = gmtModified[1].format('YYYY-MM-DD')
      }

      const result = await this.$server.label.getLabelList(params)
        .finally(() => {
          this.listLoading = false
        })
      if (result.code === 200) {
        this.listData = [].concat(result.rows)

        Object.assign(this.pagination, {
          current: params.current,
          total: result.total
        })
      } else {
        this.$message.error(result.msg || '请求错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./common");
</style>
