<template>
  <div class="data-access-setting">
    <div class="set-main">
      <div class="header">
        <span class="data_con">{{fieldInfo.name}}</span>
        <a-button class="data_btn" v-on:click="back">返回</a-button>
      </div>
      <div class="scrollable scrollbar">
        <div class="setting">
          <!-- <div class="set_bar">
            <a-input placeholder="请输入关键词" class="search_input">
              <a-icon slot="prefix" type="search" />
            </a-input>
            <a-button :disabled="!selectDrawer" v-on:click="handleShowSetting(1)">设置字段类型</a-button>
            <a-button :disabled="!selectDrawer" v-on:click="handleShowSetting(2)">设置字段属性</a-button>
            <a-button :disabled="!selectDrawer" v-on:click="handleShowSetting(3)">设置是否可见</a-button>
          </div> -->
          <div class="table">
            <a-table
              rowKey='id'
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="data"
              :loading='sping'
              :scroll="{ x: 1200 }"
              bordered
            >
            <template slot="alias" slot-scope="text, record, index">
              <a-input style="width:100%;height:32px" :value="text" @blur.stop.prevent="handleAliasBlur($event, record, index, 'alias')" @change.stop.prevent="handleChangeValue($event, record, index, 'alias')"/>
            </template>
            <template slot="dataType" slot-scope="text, record, index">
              <a-select :value="text" style="width:100%;" @change="(value) => handleSelectChangeValue(value, record, index, 'dataType')">
                <a-select-option value="BIGINT">
                  整数
                </a-select-option>
                <a-select-option value="TIMESTAMP">
                  日期时间
                </a-select-option>
                <a-select-option value="VARCHAR">
                  字符串
                </a-select-option>
                <a-select-option value="DOUBLE">
                  小数
                </a-select-option>
              </a-select>
            </template>
            <template slot="role" slot-scope="text, record, index">
              <a-select default-value="1" :value='`${text}`' @change="(value) => handleSelectChangeValue(value, record, index, 'role')">
                <a-select-option value="1">
                  维度
                </a-select-option>
                <a-select-option value="2">
                  度量
                </a-select-option>
              </a-select>
            </template>
            <template slot="comment" slot-scope="text, record, index">
              <a-input style="width:100%;height:32px" :value="text" @change.stop.prevent="handleChangeValue($event, record, index, 'comment')"/>
            </template>
            <template slot="description" slot-scope="description">
              {{ description }}
            </template>
            <template slot="visible" slot-scope="text, record, index">
              <a-select style="width:60px" default-value="true" :value='`${text}`' @change="(value) => handleSelectChangeValue(value, record, index, 'visible')">
                <a-select-option value="true">
                  是
                </a-select-option>
                <a-select-option value="false">
                  否
                </a-select-option>
              </a-select>
            </template>
            </a-table>
          </div>
          <a-modal :visible="showSetting" @cancel="showSetting = false">
            <template v-if="setType === 1">
              <a-form-model :model="batchType" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-model-item label="字段类型" required>
                  <a-select default-value="BIGINT" style="width: 100px" v-model="batchType.value">
                    <a-select-option value="BIGINT"> 整数 </a-select-option>
                    <a-select-option value="DATE"> 日期时间 </a-select-option>
                    <a-select-option value="VARCHAR"> 字符串 </a-select-option>
                    <a-select-option value="double"> 小数 </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model>
            </template>
            <template v-else-if="setType === 2">
              <a-form-model :model="batchRole" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-model-item label="字段属性" required>
                  <a-radio-group name="batchRole" default-value="1" v-model="batchRole.value">
                    <a-radio value="1">
                      维度
                    </a-radio>
                    <a-radio value="2">
                      度量
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-form-model>
            </template>
            <template v-else-if="setType === 3">
              <a-form-model :model="batchVisible" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-model-item label="是否可见" required>
                  <a-radio-group name="batchVisible" default-value="true" v-model="batchVisible.value">
                    <a-radio value="true">
                      是
                    </a-radio>
                    <a-radio value="false">
                      否
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-form-model>
            </template>
          </a-modal>
        </div>
        <div class="set_btn">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col>
              <a-button style="width:88px;height:30px;" @click="back">
                取消
              </a-button>
            </a-col>
            <a-col>
              <a-button type="primary" style="width:88px;height:30px;" @click="handleSave">
              保存
            </a-button>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '原名',
    dataIndex: 'name'
  },
  {
    title: '别名',
    dataIndex: 'alias',
    scopedSlots: { customRender: 'alias' }
  },
  {
    title: '字段类型',
    dataIndex: 'dataType',
    scopedSlots: { customRender: 'dataType' }
  },
  {
    title: '字段属性',
    dataIndex: 'role',
    scopedSlots: { customRender: 'role' }
  },
  {
    title: '字段说明',
    dataIndex: 'comment',
    scopedSlots: { customRender: 'comment' }
  },
  {
    title: '注释',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '是否可见',
    dataIndex: 'visible',
    scopedSlots: { customRender: 'visible' }
  }
]

export default {
  props: {
    fieldInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      data: [],
      sping: true,
      showSetting: false,
      setType: '',
      batchType: { value: 'BIGINT' },
      batchRole: { value: '1' },
      batchVisible: { value: 'true' },
      columns,
      selectedRows: [],
      current: ['mail'],
      openKeys: ['sub1'],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  computed: {
    ...mapState({
      formInfo: state => state.dataAccess.modelInfo,
      modelId: state => state.dataAccess.modelId,
      readRows: state => state.dataAccess.readRows,
      modelType: state => state.dataAccess.modelType,
      modelName: state => state.dataAccess.modelName,
      databaseName: state => state.dataAccess.databaseName
    }),
    selectDrawer() {
      return this.selectedRows.length > 0
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
        }
      }
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    handleChangeValue(event, record, index, key) {
      const newValue = event.target.value
      record[key] = newValue
    },
    handleAliasBlur(event, record, index, key) {
      if (!event.target.value) {
        message.error('别名不能为空')
        record[key] = record.name
      }
    },
    handleSelectChangeValue(value, record, index, key) {
      record[key] = value
    },
    async handleGetData() {
      this.sping = true
      // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
      const databaseName = this.formInfo && this.formInfo.databaseName ? this.formInfo.databaseName : this.databaseName
      const result = await this.$server.dataAccess.getTableFieldDetail({
        databaseName,
        sourceId: this.modelId,
        sourceName: this.modelName,
        tableId: this.fieldInfo.id,
        tableName: this.fieldInfo.name
      }).finally(() => {
        this.sping = false
      })

      if (result.code === 200) {
        this.data = [].concat(result.rows)
      } else {
        this.$message.error(result.msg)
      }
    },
    showModal() {
      this.visible = true
    },
    /**
     * 抽屉-批量设置
     */
    handleShowSetting(type) {
      this.showSetting = true
      this.setType = type
    },
    back() {
      this.$emit('on-change-componet', 'Main')
    },
    handleSave() {
      this.handleSaveWriteTable()
    },
    async handleSaveWriteTable() {
      const writeResult = await this.$server.dataAccess.saveDataTable({
        rows: this.readRows,
        tableId: this.fieldInfo.id
      })

      if (writeResult.code === 200) {
        this.handleSaveTableField()
      } else {
        this.$message.error(writeResult.msg)
      }
    },
    async handleSaveTableField() {
      const result = await this.$server.dataAccess.saveTableField({
        rows: this.data
      })

      if (result.code === 200) {
        this.$message.success({
          content: '保存成功',
          duration: 0.5
        }).then(() => {
          this.back()
        })
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>

<style lang="styl" scope>
@import "./dataAccess-setting.styl";
</style>
