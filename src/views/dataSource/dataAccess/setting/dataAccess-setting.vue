<template>
  <div class="data-access-setting">
    <div class="set-main">
      <div class="header">
        <span class="data_con">{{fieldInfo.name}}</span>
        <a-button class="data_btn" v-on:click="back">返回</a-button>
      </div>
      <div class="setting">
        <div class="search_bar">
          <a-input placeholder="请输入关键词" class="search_input">
            <a-icon slot="prefix" type="search" />
          </a-input>
        </div>
        <div class="table">
          <a-table
            rowKey='id'
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="data"
            :loading='sping'
            :pagination='false'
            :scroll="{ x: 1200, y: 570 }"
            bordered
          >
          <span slot="fieldNickname" slot-scope="text, record, index">
            <a-input style="width:100%;height:32px" :value="text" @change.stop.prevent="handleChangeValue($event, record, index, 'fieldNickname')"/>
          </span>
          <span slot="fieldType" slot-scope="text, record, index">
            <a-select :value="text" style="width:100%;" @change="(value) => handleSelectChangeValue(value, record, index, 'fieldType')">
              <a-select-option value="INT">
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
          </span>
          <span slot="fieldNature" slot-scope="text, record, index">
            <a-select default-value="true" :value='`${text}`' @change="(value) => handleSelectChangeValue(value, record, index, 'fieldNature')">
              <a-select-option value="true">
                维度
              </a-select-option>
              <a-select-option value="false">
                度量
              </a-select-option>
            </a-select>
          </span>
          <span slot="fieldComment" slot-scope="text, record, index">
            <a-input style="width:100%;height:32px" :value="text" @change.stop.prevent="handleChangeValue($event, record, index, 'fieldComment')"/>
          </span>
          <span slot="fieldDesc" slot-scope="fieldDesc">
            {{ fieldDesc }}
          </span>
          <span slot="visible" slot-scope="text, record, index">
              <a-select style="width:60px" default-value="true" :value='`${text}`' @change="(value) => handleSelectChangeValue(value, record, index, 'visible')">
                <a-select-option value="true">
                  是
                </a-select-option>
                <a-select-option value="false">
                  否
                </a-select-option>
              </a-select>
          </span>
          </a-table>
        </div>
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
</template>

<script>
import { fetchGetTableField, fetchWriteTable, fetchSaveTableField } from '@/api/dataAccess/api'
import { mapState } from 'vuex'
const columns = [
  {
    title: '原名',
    dataIndex: 'fieldName'
  },
  {
    title: '别名',
    dataIndex: 'fieldNickname',
    scopedSlots: { customRender: 'fieldNickname' }
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
    scopedSlots: { customRender: 'fieldType' }
  },
  {
    title: '字段属性',
    dataIndex: 'fieldNature',
    scopedSlots: { customRender: 'fieldNature' }
  },
  {
    title: '字段说明',
    dataIndex: 'fieldComment',
    scopedSlots: { customRender: 'fieldComment' }
  },
  {
    title: '注释',
    dataIndex: 'fieldDesc',
    scopedSlots: { customRender: 'fieldDesc' }
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
      columns,
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
      modelType: state => state.dataAccess.modelType
    }),
    rowSelection() {
      return {}
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
    handleSelectChangeValue(value, record, index, key) {
      record[key] = value
    },
    async handleGetData() {
      this.sping = true
      const result = await fetchGetTableField({
        url: `/admin/dev-api/system/${this.modelType}/get/field`,
        data: {
          sourceMysqlId: this.modelId,
          databasesName: this.formInfo.databaseName,
          sourceMysqName: this.formInfo.name,
          tableId: this.fieldInfo.id,
          tableName: this.fieldInfo.name
        }
      }).finally(() => {
        this.sping = false
      })

      if (result.data.code === 200) {
        this.data = [].concat(result.data.rows)
      } else {
        this.$message.error(result.data.msg)
      }
    },
    showModal() {
      this.visible = true
    },
    back() {
      this.$emit('on-change-componet', 'Main')
    },
    handleSave() {
      this.handleSaveWriteTable()
    },
    async handleSaveWriteTable() {
      console.log(this.fieldInfo)
      const writeResult = await fetchWriteTable({
        url: '/admin/dev-api/system/sourceTbale/save/table',
        data: {
          rows: this.readRows,
          tableId: this.fieldInfo.id
          // databaseName: this.formInfo.databaseName,
          // sourceMysqName: this.formInfo.name
        }
      })

      if (writeResult.data.code === 200) {
        this.handleSaveTableField()
      } else {
        this.$message.error(writeResult.data.msg)
      }
    },
    async handleSaveTableField() {
      const result = await fetchSaveTableField({
        url: '/admin/dev-api/system/field/save/field',
        data: {
          rows: this.data
        }
      })

      if (result.data.code === 200) {
        this.$message.success({
          content: '保存成功',
          duration: 0.5
        }).then(() => {
          this.back()
        })
      } else {
        this.$message.error(result.data.msg)
      }
    }
  }
}
</script>

<style lang="styl" scope>
@import "./dataAccess-setting.styl";
</style>
