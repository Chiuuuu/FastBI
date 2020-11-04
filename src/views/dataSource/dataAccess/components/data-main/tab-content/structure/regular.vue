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
      <a-form-model-item label="执行频率" prop="type">
        <a-select v-model="form.type" placeholder="请选择更新方式">
          <a-select-option value="1">只执行一次</a-select-option>
          <a-select-option value="2">重复执行</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item style="margin-left: 16.6%" prop="freq" v-show="form.type === '2'">
        <div>
          <span>每隔&nbsp;</span>
          <a-input style="width:100px" v-model="form.freq"></a-input>
          <a-select class="regular-bordered" style="width:80px" v-model="form.freqType" placeholder="请选择更新方式">
            <a-select-option value="1">小时</a-select-option>
            <a-select-option value="2">天</a-select-option>
          </a-select>
          <span>&nbsp;执行一次</span>
        </div>
      </a-form-model-item>
      <a-form-model-item label="开始时间" prop="starttime">
        <a-date-picker
          style="width:100%"
          show-time
          v-model="form.starttime"
          :disabled-date="disabledStartDate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          ></a-date-picker>
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="endtime">
        <a-date-picker
          style="width:100%"
          show-time
          v-model="form.endtime"
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

const columns = [
  {
    title: '表名',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '抽取方式',
    dataIndex: 'extractType',
    scopedSlots: { customRender: 'extractType' }
  },
  {
    title: '增量字段',
    dataIndex: 'field',
    scopedSlots: { customRender: 'field' }
  }
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
        type: undefined,
        freq: undefined,
        freqType: '1',
        starttime: undefined,
        endtime: undefined
      },
      regRules: {
        name: [{ required: true, message: '请输入任务名称' }],
        type: [{ required: true, message: '请选择更新方式' }],
        freq: [
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
        starttime: [{ required: true, message: '请选择开始时间' }],
        endtime: [
          {
            validator: this.endtimeValidator,
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
  watch: {
    show(newValue, oldValue) {
      if (newValue && typeof this.formData === 'object') {
        const newForm = {}
        for (const key in this.form) {
          if (key === 'freqType' && !this.formData[key]) {
            newForm[key] = '1'
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
      console.log('toMomentObj', value)
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : null
    }
  },
  methods: {
    disabledStartDate(date) {
      return date && date < moment().subtract(1, 'days')
    },
    disabledEndDate(date) {
      let time = this.form.starttime || ''
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
      this.$set(this.form, 'starttime', dateString)
    },
    handleEndTimeChange(value, dateString) {
      this.$set(this.form, 'endtime', dateString)
    },
    // 自定义结束时间校验
    endtimeValidator(rule, value, callback) {
      if (+new Date(value) < +new Date(this.form.starttime)) {
        callback(new Error('endtime inValid'))
      } else {
        callback()
      }
    },
    resetForm() {
      this.form = {
        name: undefined,
        type: undefined,
        freq: undefined,
        freqType: '1',
        starttime: undefined,
        endtime: undefined
      }
    },
    handleClose() {
      this.$emit('close')
    },
    handleOk() {
      this.$refs.form.validate((ok, obj) => {
        // 结束时间没问题&&选择只执行一次&&仅重复执行的表单报错时,可以保存
        if (ok || (!obj.endtime && this.form.type === '1' && obj.freq)) {
          console.log(this.form)
          this.resetForm()
          this.handleClose()
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
