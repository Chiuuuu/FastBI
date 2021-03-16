<template>
  <a-row class="main" style="background-color: f6f6f6" :gutter="16">
    <a-col class="main scrollbar" :span="5">
      <Menu :file.sync="file" />
    </a-col>
    <a-col class="main scrollbar" :span="19">
      <div class="main main-bg main-padding scrollbar">
        <template v-if="file && file.id">
          <div class="list-title">{{ file.name || '数据字典' }}</div>
          <a-row type="flex" justify="space-between">
            <a-col>
              <a-form-model layout="inline">
                <a-form-model-item>
                  <a-button type="primary" @click="handleShowModal('add')">新增</a-button>
                </a-form-model-item>
                <a-form-model-item>
                  <a-button type="primary" @click="handleDelete">删除</a-button>
                </a-form-model-item>
              </a-form-model>
            </a-col>
            <a-col>
              <a-form-model ref="form" layout="inline" :model="searchForm">
                <a-form-model-item prop="dictName">
                  <a-input
                    placeholder="代码名称"
                    v-model="searchForm.dictName"
                    style="width: 240px"
                  ></a-input>
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
            :row-selection="rowSelection"
            :pagination="false"
            :scroll="{ x: 400, y: 'calc(100vh - 320px)' }"
          >
            <template #index="text, record, index">
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </template>
            <template #config="text, record, index">
              <a @click="handleShowModal('update', record)">修改</a>
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

          <CodeForm
            :visible.sync="visible"
            :row-data.sync="rowData"
            :type="formType"
            :menu-id="file.id"
            @refresh="handleGetData" />
        </template>

        <a-empty v-else class="main-empty">
          <span slot="description">请新建数据字典或者选中左侧数据字典</span>
        </a-empty>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import Menu from './components/menu'
import paginationMixin from '../label/mixins/pagination'
import CodeForm from './components/form'

const listColumn = [
  {
    title: '序号',
    scopedSlots: { customRender: 'index' },
    width: 90
  },
  {
    title: '代码',
    dataIndex: 'dictValue',
    width: 90
  },
  {
    title: '代码名称',
    dataIndex: 'dictName',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'config',
    width: 100,
    ellipsis: true,
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'dictList',
  mixins: [paginationMixin],
  data() {
    return {
      file: {},
      searchForm: {
        dictName: ''
      },
      visible: false,
      listLoading: false,
      listColumn,
      listData: [],
      selectedRows: [],
      rowData: {},
      formType: 'add'
    }
  },
  components: {
    Menu,
    CodeForm
  },
  computed: {
    rowSelection() {
      return {
        fixed: true,
        onSelect: (record, selected, selectedRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRows = selectedRows
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRows = selectedRows
        }
      }
    }
  },
  watch: {
    file(newValue, oldValue) {
      if (newValue.id) {
        this.handleGetData()
      }
    }
  },
  methods: {
    // 新增
    handleShowModal(type, record = {}) {
      this.formType = type
      this.visible = true
      this.rowData = record
    },
    // 批量删除
    handleDelete() {
      if (this.selectedRows.length < 1) {
        return this.$message.error('请选择数据代码')
      }
      this.$confirm({
        title: '确认提示',
        content: `是否确认删除所选代码?`,
        onOk: async () => {
          const deleIdList = this.selectedRows.map(item => item.id)
          const result = await this.$server.dataDictionary.deleDataDictionary(deleIdList)
            .finally(() => {
              this.listLoading = false
            })
          if (result.code === 200) {
            this.$message.success('删除成功')
            this.handleGetData()
          } else {
            this.$message.error(result.msg || '请求错误')
          }
        }
      })
    },
    async handleGetData() {
      this.listLoading = true

      const params = {
        catalogId: this.file.id,
        dictName: this.searchForm.dictName,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize
      }

      const result = await this.$server.dataDictionary.getDictionaryList(params)
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
    },
    // 重置表单
    handleResetForm() {
      this.searchForm = this.$options.data().searchForm
      this.$refs.form && this.$refs.form.resetFields()
      this.pagination = this.$options.data().pagination
      this.$nextTick(() => {
        this.handleGetData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../label/common");
.main-padding {
  padding-top: 0;
  padding-bottom: 0;
}
.list-title {
  line-height: 50px;
  margin-bottom: 13px;
  font-size: 17px;
  border-bottom: 1px solid #efefef
}
.main-empty {
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.65);
}
</style>
