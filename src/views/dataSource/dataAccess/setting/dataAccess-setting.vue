<template>
  <div class="data-access-setting">
    <div class="set-main">
      <div class="header">
        <span class="data_con">{{fieldInfo.name}}</span>
        <a-button class="data_btn" v-on:click="back">返回</a-button>
      </div>
      <div class="scrollable scrollbar">
        <div class="setting">
          <div class="set_bar">
            <a-input placeholder="请输入关键词" class="search_input">
              <a-icon slot="prefix" type="search" />
            </a-input>
            <a-button :disabled="!fieldSetable" v-on:click="handleShowSetting(1)">设置字段类型</a-button>
            <a-button :disabled="!selectDrawer" v-on:click="handleShowSetting(2)">设置字段属性</a-button>
            <a-button :disabled="!selectDrawer" v-on:click="handleShowSetting(3)">设置是否可见</a-button>
          </div>
          <div class="table">
            <a-table
              rowKey='id'
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="data"
              :loading='sping'
              :scroll="{ x: 1200 }"
            >
            <template slot="alias" slot-scope="text, record, index">
              <a-input style="width:100%;height:32px" :value="text" @blur.stop.prevent="handleAliasBlur($event, record, index, 'alias')" @change.stop.prevent="handleChangeValue($event, record, index, 'alias')"/>
            </template>
            <template slot="dataType" slot-scope="text, record">
              <!-- <a-select :value="text" style="width:100%;" @change="(value) => handleSelectChangeValue(value, record, index, 'dataType')">
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
              </a-select> -->
              <field-select
                :text="text | formatField"
                :select-data="record"
                :contextmenus="fieldContenxtMenu"
                :isDimension="record.role === 1"
              />
            </template>
            <template slot="role" slot-scope="text, record">
              <!-- <a-select default-value="1" :value='`${text}`' @change="(value) => handleSelectChangeValue(value, record, index, 'role')">
                <a-select-option value="1">
                  维度
                </a-select-option>
                <a-select-option value="2">
                  度量
                </a-select-option>
              </a-select> -->
              <field-select
                :text="text | formatRole"
                :select-data="record"
                :contextmenus="[{
                  name: '转换为' + (text === 1 ? '度量' : '维度'),
                  roleType: text === 1 ? 2 : 1,
                  onClick: switchRoleType
                }]"
                :isDimension="record.role === 1"
              />
            </template>
            <template slot="description" slot-scope="text, record, index">
              <a-input style="width:100%;height:32px" :value="text" @change.stop.prevent="handleChangeValue($event, record, index, 'comment')"/>
            </template>
            <template slot="comment" slot-scope="comment">
              {{ comment }}
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
          <a-modal :visible="showSetting" @cancel="showSetting = false" @ok="handleBatchSetting">
            <template v-if="setType === 1">
              <a-form-model :model="batchType" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-model-item label="字段类型" prop="value" required>
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
                <a-form-model-item label="字段属性" prop="value" required>
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
                <a-form-model-item label="是否可见" prop="value" required>
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
import FieldSelect from '@/components/dataSource/field-select/select'

const columns = [
  {
    title: '原名',
    ellipsis: true,
    width: 200,
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
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '注释',
    dataIndex: 'comment',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'comment' }
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
  components: {
    FieldSelect
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
      wrapperCol: { span: 14 },
      fieldContenxtMenu: [
        {
          name: '转换为整数',
          dataType: 'BIGINT',
          onClick: this.switchFieldType
        },
        {
          name: '转换为小数',
          dataType: 'DOUBLE',
          onClick: this.switchFieldType
        },
        {
          name: '转换为字符串',
          dataType: 'VARCHAR',
          onClick: this.switchFieldType
        },
        {
          name: '转换为日期时间',
          dataType: 'TIMESTAMP',
          onClick: this.switchFieldType
        }
      ]
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
    fieldSetable() {
      // 相同的字段属性(维度度量)才能批量设置字段类型
      return this.selectDrawer && !this.selectedRows.some((item, index, list) => list[0].role !== item.role)
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
  filters: {
    formatField(value) {
      switch (value) {
        case 'BIGINT':
          value = '整数'
          break
        case 'TIMESTAMP':
          value = '日期时间'
          break
        case 'DOUBLE':
          value = '小数'
          break
        case 'VARCHAR':
          value = '字符串'
          break
      }
      return value
    },
    formatRole(value) {
      if (value === 1) {
        return '维度'
      } else {
        return '度量'
      }
    }
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
    switchFieldType(e, item, vm) {
      let dataType = item.dataType
      console.log(dataType)
      vm.selectData.dataType = dataType
    },
    switchRoleType(e, item, vm) {
      let roleType = item.roleType
      console.log(roleType)
      vm.selectData.role = roleType
    },
    async handleGetData() {
      this.sping = true
      let databaseName = this.formInfo ? this.formInfo.databaseName : ''
      // sql, oracle的数据库名称在formInfo里, excel的在dabaseName里
      if (['excel', 'csv'].indexOf(this.modelType) > -1) {
        databaseName = this.databaseName
      }
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
    handleBatchSetting() {
      if (this.setType === 1) {
        this.saveBatchType()
      } else if (this.setType === 2) {
        this.saveBatchRole()
      } else if (this.setType === 3) {
        this.saveBatchVisible()
      }
    },
    async saveBatchType () {
      let value = this.batchType.value
      console.log(value)
    },
    async saveBatchRole () {
      let value = this.batchRole.value
      console.log(value)
    },
    async saveBatchVisible () {
      let value = this.batchVisible.value
      console.log(value)
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
