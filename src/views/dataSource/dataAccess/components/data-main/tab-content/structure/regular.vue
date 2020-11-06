<template>
  <a-modal :bodyStyle="bodyStyle" width="700px" title="添加定时任务" :confirmLoading="loading" :visible="show" @cancel="handleClose" @ok="handleOk">
    <a-spin :spinning="spinning">
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
        <a-form-model-item label="执行频率" prop="repeat">
          <a-select v-model="form.repeat" placeholder="请选择更新方式">
            <a-select-option value="0">只执行一次</a-select-option>
            <a-select-option value="1">重复执行</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
        style="margin-left: 100px"
        prop="interval"
        v-if="form.repeat === '1'"
        :rules="intervalRules"
        >
          <div>
            <span>每隔&nbsp;</span>
            <a-input style="width:100px" v-model="form.interval"></a-input>
            <a-select class="regular-bordered" style="width:80px" v-model="form.frequency" placeholder="请选择更新方式">
              <a-select-option value="0">分钟</a-select-option>
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
        <a-form-model-item class="form-not-required" label="结束时间" prop="gmtEnd">
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
          <span>全量更新</span>
          <!-- <a-select style="width: 150px" :default-value="undefined" placeholder="请选择方式">
            <a-select-option value="1">全量更新</a-select-option>
            <a-select-option value="2">增量更新</a-select-option>
          </a-select> -->
        </template>
        <template #field="list">
          <a-select style="width: 150px" :default-value="undefined" placeholder="请选择字段">
            <a-select-option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </template>
      </a-table>
    </a-spin>
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
  },
  {
    title: '抽取方式',
    dataIndex: 'extractType',
    scopedSlots: { customRender: 'extractType' }
  }
  // 暂不支持增量
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
    row: [Object, String],
    formData: [Object, String],
    tableList: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      spinning: false,
      loading: false,
      isEdit: false,
      form: {
        name: undefined,
        repeat: undefined,
        interval: undefined,
        frequency: '0',
        gmtStart: undefined,
        gmtEnd: undefined
      },
      regData: {},
      regRules: {
        name: [
          { required: true, message: '请输入任务名称' },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '长度为1~20'
          }
        ],
        repeat: [{ required: true, message: '请选择更新方式' }],
        gmtStart: [{ required: true, message: '请选择开始时间' }],
        gmtEnd: [
          {
            validator: this.gmtEndValidator,
            message: '结束时间不能小于开始时间',
            trigger: 'change'
          }
        ]
      },
      intervalRules: [
        { required: true, message: '请填写频率' },
        {
          validator(rule, value, callback) {
            if (/^[1-9]\d*$/.test(value)) {
              callback()
            } else {
              callback(new Error('请填写正整数'))
            }
          },
          trigger: 'change'
        }
      ],
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
      // // 点击编辑
      // if (newValue && typeof this.row === 'object') {
      //   this.handleGetRegularInfo(this.row.id)
      // }
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
    handleGetRegularInfo(id) {
      this.spinning = true
      this.$server.dataAccess.getRegularInfo(id)
        .then(res => {
          if (res.code === 200) {
            this.regData = res.data
            this.isEdit = true
            for (const key in this.form) {
              // 特殊处理
              if (key === 'repeat') {
                this.$set(this.form, 'repeat', String(+this.regData.repeat))
              } else if (key === 'frequency') {
                this.$set(this.form, 'frequency', String(this.regData.frequency))
              } else {
                this.$set(this.form, key, this.regData[key])
              }
            }
          } else {
            this.$message.error(res.msg)
          }
          this.spinning = false
        })
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
        repeat: undefined,
        interval: undefined,
        frequency: '0',
        gmtStart: undefined,
        gmtEnd: undefined
      }
    },
    handleClose() {
      this.resetForm()
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    async handleAddRegularInfo() {
      return this.$server.dataAccess.addRegularInfo({
        ...this.form,
        extractType: 0, // 暂时写死全量
        target: this.row.id,
        sourceId: this.modelId
      })
        .finally(() => {
          this.loading = false
        })
    },
    async handleUpdateRegularInfo() {
      return this.$server.dataAccess.putRegularInfo({
        ...this.form,
        extractType: 0, // 暂时写死全量
        target: this.row.id,
        id: this.regData.id,
        sourceId: this.modelId
      })
        .finally(() => {
          this.loading = false
        })
    },
    handleOk() {
      this.$refs.form.validate(async (ok, obj) => {
        // 结束时间没问题&&选择只执行一次&&仅重复执行的表单报错时,可以保存
        if (ok) {
          this.loading = true
          let res
          if (this.isEdit) {
            res = await this.handleUpdateRegularInfo()
          } else {
            res = await this.handleAddRegularInfo()
          }
          if (res.code === 200) {
            this.$message.success('保存成功')
            // 更新后重刷列表, 新增后直接插入(后端暂时支持这样)
            if (this.isEdit) {
              this.$parent.$refs.extract.updateRows(res.data)
              // this.$emit('updateRows', res.data)
            } else {
              this.$parent.$refs.extract.regData.push(res.data)
            }
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
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
  /deep/ .ant-form-item-label {
    width: 100px !important;
  }
</style>
