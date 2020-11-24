<template>
  <a-drawer
    title="字段重命名"
    width="80%"
    :visible="isShow"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleClose"
  >
    <div class="drawer-btn">
      <a-button style="width: 110px"
                :disabled="!selectDrawer"
                @click="handleShowSetting($event, 1)">设置字段类型</a-button>
      <a-button style="width: 110px"
                :disabled="!selectDrawer"
                @click="handleShowSetting($event, 2)">设置字段属性</a-button>
      <a-button style="width: 110px"
                :disabled="!selectDrawer"
                @click="handleShowSetting($event, 3)">设置是否可见</a-button>
    </div>
    <div v-if="Object.keys(tables).length > 0"
         class="drawer-menu">
      <a-collapse style="width: 100%">
        <a-collapse-panel v-for="(value, name) in tables"
                          :key="name"
                          :header="value[0].tableName">
          <a-table :row-selection="rowSelection"
                   :columns="column"
                   :data-source="value"
                   rowKey="id"
                   bordered>
            <template #alias="text">
              <a-input :value="text"
                       style="width: 156px height: 32px" />
            </template>
            <template #dataType="text, record">
              <field-select
                :text="text | formatField"
                :select-data="record"
                :contextmenus="fieldContenxtMenu"
                :isDimension="record.role === 1"
              />
            </template>
            <template #role="text, record">
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
            <template #description="text">
              <a-input :value="text"
                       style="width: 156px height: 32px" />
            </template>
            <template #comment="text">
              <a-input :value="text"
                       style="width: 100px height: 32px" />
            </template>
            <template #visible="text">
              <a-select :default-value="String(text)">
                <a-select-option value="true"> 是 </a-select-option>
                <a-select-option value="false"> 否 </a-select-option>
              </a-select>
            </template>
          </a-table>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <a-empty v-else class="drawer-menu" />
    <div :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }">
      <a-button :style="{ marginRight: '8px' }"
                @click="$emit('close')">
        取消
      </a-button>
      <a-button type="primary"
                @click="handleSave"> 保存 </a-button>
    </div>
    <a-modal :visible="showSetting" @cancel="showSetting = false" @ok="handleBatchSetting">
      <template v-if="setType === 1">
        <a-form-model :model="batchType" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="字段类型" required>
            <a-select default-value="INT" style="width: 100px" v-model="batchType.value">
              <a-select-option value="INT"> 整数 </a-select-option>
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
            <a-radio-group name="batchRole" :default-value="1" v-model="batchRole.value">
              <a-radio :value="1">
                维度
              </a-radio>
              <a-radio :value="2">
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
  </a-drawer>
</template>

<script>
import FieldSelect from '@/components/dataSource/field-select/select'

const column = [
  {
    title: '原名',
    dataIndex: 'name'
  },
  {
    title: '别名',
    dataIndex: 'alias',
    width: 150,
    scopedSlots: {
      customRender: 'alias'
    }
  },
  {
    title: '字段类型',
    dataIndex: 'dataType',
    scopedSlots: {
      customRender: 'dataType'
    }
  },
  {
    title: '字段属性',
    dataIndex: 'role',
    scopedSlots: {
      customRender: 'role'
    }
  },
  {
    title: '字段说明',
    dataIndex: 'description',
    width: 150,
    scopedSlots: {
      customRender: 'description'
    }
  },
  {
    title: '注释',
    dataIndex: 'comment',
    width: 100,
    scopedSlots: {
      customRender: 'comment'
    }
  },
  {
    title: '是否可见',
    dataIndex: 'visible',
    scopedSlots: {
      customRender: 'visible'
    }
  }
]

export default {
  name: 'batchSetting',
  components: {
    FieldSelect
  },
  props: {
    isShow: Boolean,
    tables: [Array, Object, String]
  },
  data() {
    return {
      column,
      selectedRows: [],
      showSetting: false,
      setType: '',
      batchType: { value: 'INT' },
      batchRole: { value: 1 },
      batchVisible: { value: 'true' },
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
          name: '转换为日期',
          dataType: 'DATE',
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
  created () {
    console.log(Object.entries(this.tables))
  },
  computed: {
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
    handleSave() {
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    },
    switchFieldType(e, item, vm) {
      let dataType = item.dataType
      vm.selectData.convertType = dataType
    },
    switchRoleType(e, item, vm) {
      let roleType = item.roleType
      vm.selectData.role = roleType
    },
    handleShowSetting(e, type) {
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
      this.showSetting = false
    },
    async saveBatchType () {
      let value = this.batchType.value
      this.selectedRows.map(item => {
        item.convertType = value
      })
    },
    async saveBatchRole () {
      let value = this.batchRole.value
      this.selectedRows.map(item => {
        item.role = value
      })
    },
    async saveBatchVisible () {
      let value = this.batchVisible.value
      this.selectedRows.map(item => {
        item.visible = (value === 'true')
      })
    }
  }
}
</script>
