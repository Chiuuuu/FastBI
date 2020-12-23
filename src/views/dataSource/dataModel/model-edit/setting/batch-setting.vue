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
        @click="handleShowSetting($event, 'dataType')">设置字段类型</a-button>
      <a-button style="width: 110px"
        :disabled="!selectDrawer"
        @click="handleShowSetting($event, 'role')">设置字段属性</a-button>
      <a-button style="width: 110px"
        :disabled="!selectDrawer"
        @click="handleShowSetting($event, 'visible')">设置是否可见</a-button>
    </div>
    <div v-if="Object.keys(cacheTables).length > 0"
         class="drawer-menu">
      <a-collapse style="width: 100%">
        <a-collapse-panel
          v-for="(value, name) in cacheTables"
          :key="name"
          :header="value[0].tableName">
          <a-table
            :row-selection="rowSelection"
            :columns="column"
            :data-source="value"
            rowKey="id"
            bordered>
            <template #alias="text, record">
              <a-input
                v-model="record.alias"
                :maxLength="20"
                @change="handleCheckName"
                style="width: 156px height: 32px" />
            </template>
            <template #dataType="text, record">
              <field-select
                :text="(text || record.dataType) | formatField"
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
            <template #description="text, record">
              <a-input v-model="record.description" :maxLength="200" style="width: 156px height: 32px" />
            </template>
            <template #comment="text, record">
              <a-input v-model="record.comment" style="width: 100px height: 32px" />
            </template>
            <template #visible="text, record, index">
              <a-select :value="`${record.visible}`" @change="(value) => handleSelect(value, record, index)">
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
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
      <a-button :style="{ marginRight: '8px' }" @click="$emit('close')">
        取消
      </a-button>
      <a-button type="primary" @click="handleSave"> 保存 </a-button>
    </div>
    <a-modal :visible="showSetting" @cancel="handleCancelModal" @ok="handleBatchSetting">
      <template v-if="setType === 'dataType'">
        <a-form-model :model="modalForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="字段类型" required>
            <a-select default-value="BIGINT" style="width: 100px" v-model="modalForm.dataType">
              <a-select-option value="BIGINT"> 整数 </a-select-option>
              <a-select-option value="DOUBLE"> 小数 </a-select-option>
              <a-select-option value="VARCHAR"> 字符串 </a-select-option>
              <a-select-option value="DATE"> 日期 </a-select-option>
              <a-select-option value="TIMESTAMP"> 日期时间 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template v-else-if="setType === 'role'">
        <a-form-model :model="modalForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="字段属性" required>
            <a-radio-group name="batchRole" :default-value="1" v-model="modalForm.role">
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
      <template v-else-if="setType === 'visible'">
        <a-form-model :model="modalForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="是否可见" required>
            <a-radio-group name="batchVisible" :default-value="true" v-model="modalForm.visible">
              <a-radio :value="true">
                是
              </a-radio>
              <a-radio :value="false">
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
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
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
      cacheTables: '',
      modalForm: {
        dataType: 'BIGINT',
        role: 1,
        visible: true
      },
      validatePass: true,
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
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = [].concat(selectedRows)
        }
      }
    }
  },
  computed: {
    selectDrawer() {
      return this.selectedRows.length > 0
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(value) {
        this.cacheTables = value ? cloneDeep(this.tables) : ''
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
        case 'DATE':
          value = '日期'
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
    handleSelect(value, record, index) {
      const has = Object.keys(this.cacheTables).some(item => (item === record.tableNo) || (item === `${record.tableNo}`))
      if (has) {
        this.cacheTables[record.tableNo].splice(index, 1, {
          ...record,
          visible: value === 'true'
        })
      }
    },
    handleCheckName: debounce(function(event) {
      const value = event.target.value
      let hasSame = false
      Object.values(this.tables).forEach(list => {
        if (list.some(item => item.alias === value)) {
          hasSame = true
        }
      })
      if (hasSame) {
        this.validatePass = false
        this.$message.error('存在同名字段, 请重新命名')
      } else {
        this.validatePass = true
      }
    }, 500),
    handleSave() {
      if (this.validatePass) {
        this.$emit('success', this.cacheTables)
      } else {
        this.$message.error('存在同名字段, 请重新命名')
      }
    },
    handleClose() {
      this.$emit('close')
    },
    switchFieldType(e, item, vm) {
      let dataType = item.dataType
      vm.selectData.dataType = dataType
    },
    switchRoleType(e, item, vm) {
      let roleType = item.roleType
      vm.selectData.role = roleType
    },
    handleShowSetting(e, type) {
      this.showSetting = true
      this.setType = type
    },
    handleCancelModal() {
      this.modalForm = this.$options.data().modalForm
      this.showSetting = false
    },
    handleBatchSetting() {
      this.saveBatchFiled()
      this.showSetting = false
    },
    saveBatchFiled() {
      let value = this.modalForm[this.setType]
      this.selectedRows.forEach(item => {
        if (this.setType === 'visible') {
          item[this.setType] = (value === 'true')
        } else {
          item[this.setType] = value
        }
      })
    }
  }
}
</script>
