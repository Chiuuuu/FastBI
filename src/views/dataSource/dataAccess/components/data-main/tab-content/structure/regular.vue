<template>
  <a-modal :bodyStyle="bodyStyle" width="700px" title="添加定时任务" :visible="show" @cancel="handleClose" @ok="handleOk">
    <a-form-model
      ref="form"
      :model="form"
      :rules="regRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item label="任务名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入任务名称"></a-input>
      </a-form-model-item>
      <a-form-model-item label="执行频率" prop="isRepeat">
        <a-select v-model="form.isRepeat" placeholder="请选择更新方式">
          <a-select-option value="0">只执行一次</a-select-option>
          <a-select-option value="1">重复执行</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item style="margin-left: 16.6%" prop="interval" v-show="form.isRepeat === '1'">
        <div>
          <span>每隔&nbsp;</span>
          <a-input style="width:100px" v-model="form.interval"></a-input>
          <a-select class="regular-bordered" style="width:80px" v-model="form.frequency" placeholder="请选择更新方式">
            <a-select-option value="1">小时</a-select-option>
            <a-select-option value="2">天</a-select-option>
            <a-select-option value="3">周</a-select-option>
            <a-select-option value="4">月</a-select-option>
          </a-select>
          <span>&nbsp;执行一次</span>
        </div>
      </a-form-model-item>
      <a-form-model-item label="开始时间" prop="gmtStart">
        <a-date-picker
          style="width:100%"
          show-time
          v-model="form.gmtStart"
          :disabled-date="disabledStartDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          ></a-date-picker>
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="gmtEnd">
        <a-date-picker
          style="width:100%"
          show-time
          v-model="form.gmtEnd"
          :disabled-date="disabledEndDate"
          :disabled-time="disabledEndTime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择结束时间"
          ></a-date-picker>
      </a-form-model-item>
    </a-form-model>
    <a-table
      v-if="showTable"
      row-key="id"
      size="small"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tableList"
    >
      <template #extractType>
        <a-select style="width: 150px" :default-value="undefined" placeholder="请选择方式">
          <a-select-option value="1">全量更新</a-select-option>
          <a-select-option value="2">增量更新</a-select-option>
        </a-select>
      </template>
      <template #field="list">
        <a-select style="width: 150px" :default-value="undefined" placeholder="请选择字段">
          <a-select-option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

const columns = [
  {
    title: '表名',
    dataIndex: 'name',
    ellipsis: true
  }
  // 暂不支持增量
  // {
  //   title: '抽取方式',
  //   dataIndex: 'extractType',
  //   scopedSlots: { customRender: 'extractType' }
  // },
  // {
  //   title: '增量字段',
  //   dataIndex: 'field',
  //   scopedSlots: { customRender: 'field' }
  // }
]

export default {
  name: 'regularSetting',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showTable: {
      type: Boolean,
      default: false
    },
    formData: [Object, String],
    tableList: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      form: {
        name: undefined,
        isRepeat: undefined,
        interval: undefined,
        frequency: '1',
        gmtStart: undefined,
        gmtEnd: undefined
      },
      regRules: {
        name: [{ required: true, message: '请输入任务名称' }],
        isRepeat: [{ required: true, message: '请选择更新方式' }],
        interval: [
          { validator(rule, value, callback) {
              if (isNaN(value)) {
                callback(new Error('freq inValid'))
              } else {
                callback()
              }
            },
            message: '请填写数字',
            trigger: 'change'
          }
        ],
        gmtStart: [{ required: true, message: '请选择开始时间' }],
        gmtEnd: [
          {
            validator: this.gmtEndValidator,
            message: '结束时间不能小于开始时间',
            trigger: 'change'
          }
        ]
      },
      columns,
      selectedRows: [],
      rowSelection: {
        onSelect: (record, selected, selectedRows) => {
          this.selectedRows = selectedRows
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectedRows = selectedRows
        }
      }
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.dataAccess.modelName,
      modelId: state => state.dataAccess.modelId
    })
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue && typeof this.formData === 'object') {
        const newForm = {}
        for (const key in this.form) {
          if (key === 'isRepeat' && !this.formData[key]) {
            newForm[key] = '0'
          } else {
            newForm[key] = this.formData[key]
          }
        }
        this.form = newForm
        console.log(this.form)
      }
    }
  },
  filters: {
    toMomentObj: function(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : null
    }
  },
  methods: {
    disabledStartDate(date) {
      return date && date < moment().subtract(1, 'days')
    },
    disabledEndDate(date) {
      let time = this.form.gmtStart || ''
      // 如果开始时间在今天之前, 禁用从开始到今天的时间段
      if (time && +new Date(time) > +new Date()) {
        return date && date < moment(time, 'YYYY-MM-DD HH:mm:ss').startOf('hour')
      } else {
        return date && date < moment().subtract(1, 'days')
      }
    },
    disabledEndTime() {
      return {
        // disabledSeconds: () => [55, 56]
      }
    },
    handleStartTimeChange(value, dateString) {
      this.$set(this.form, 'gmtStart', dateString)
    },
    handleEndTimeChange(value, dateString) {
      this.$set(this.form, 'gmtEnd', dateString)
    },
    // 自定义结束时间校验
    gmtEndValidator(rule, value, callback) {
      if (+new Date(value) < +new Date(this.form.gmtStart)) {
        callback(new Error('gmtEnd inValid'))
      } else {
        callback()
      }
    },
    resetForm() {
      this.form = {
        name: undefined,
        isRepeat: undefined,
        interval: undefined,
        frequency: '1',
        gmtStart: undefined,
        gmtEnd: undefined
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleOk() {
      this.$refs.form.validate((ok, obj) => {
        // 结束时间没问题&&选择只执行一次&&仅重复执行的表单报错时,可以保存
        if (ok || (!obj.gmtEnd && this.form.isRepeat === '0' && obj.interval)) {
          console.log(this.form)
          this.$server.dataAccess.addRegularInfo({
            ...this.form,
            extractType: 0, // 暂时写死全量
            name: this.modelName,
            target: this.modelId
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('添加成功')
                this.$parent.$refs.extract.regData.push(res.data)
                this.resetForm()
                this.handleClose()
              } else {
                this.$message.error(res.msg)
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  /deep/ .regular-bordered .ant-select-selection {
    border-color: #d9d9d9;
  }
  /deep/ .regular-bordered .ant-select-arrow {
    color: #d9d9d9;
  }
</style>
