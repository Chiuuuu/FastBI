<template>
  <a-modal
    :bodyStyle="bodyStyle"
    :maskClosable="false"
    :zIndex="1010"
    width="700px"
    title="添加定时任务"
    :confirmLoading="loading"
    :visible="show"
    @cancel="handleClose"
    @ok="handleOk">
    <a-spin :spinning="spinning">
      <a-form-model
        ref="form"
        :model="form"
        :rules="regRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 19 }"
      >
        <template v-if="single">
          <a-form-model-item class="form-not-required" label="抽取方式" prop="extractType">
            <a-radio-group style="width:100%" v-model="form.extractType">
              <a-radio :value="0">
                <span>全量覆盖抽取</span>
                <a-popover>
                  <template slot="content">
                    每次抽取，对数据库的全部数据进行抽取，并覆盖数据库全部已有的数据
                  </template>
                  <a-icon style="margin-left:10px" type="question-circle" theme="outlined" />
                </a-popover>
              </a-radio>
              <a-radio :value="1" :disabled="modelType === 'hive' || tableType === 1">
                <span>增量抽取</span>
                <a-popover>
                  <template slot="content">
                    每次抽取，根据增量字段判断数据库中的数据是否为新增数据，对数据库的新增数据进行抽取，并追加在数据库中
                  </template>
                  <a-icon style="margin-left:10px" type="question-circle" theme="outlined" />
                </a-popover>
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="form.extractType === 1" label="抽取依据字段" prop="incrementalColumn" :rules="increaseColRules">
            <a-select v-model="form.incrementalColumn" placeholder="请选择依据字段" @change="handleSelectIncreaseField">
              <a-select-option v-for="item in increaseList[0].fieldList" :key="item.name" :value="item.name">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </template>
        <a-form-model-item label="任务名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入任务名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="执行频率" prop="repeat">
          <a-select v-model="form.repeat" placeholder="请选择更新方式">
            <a-select-option :value="0">只执行一次</a-select-option>
            <a-select-option :value="1">重复执行</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          style="margin-left: 100px"
          prop="interval"
          v-if="form.repeat === 1"
          :rules="intervalRules"
        >
          <div>
            <span>每隔&nbsp;</span>
            <a-input style="width:100px" v-model="form.interval"></a-input>
            <a-select class="regular-bordered" style="width:80px" @select="handleSelectFrequency" v-model="form.frequency" placeholder="请选择更新方式">
              <a-select-option :value="0">分钟</a-select-option>
              <a-select-option :value="1">小时</a-select-option>
              <a-select-option :value="2">天</a-select-option>
              <a-select-option :value="3">周</a-select-option>
              <a-select-option :value="4">月</a-select-option>
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
            valueFormat="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束时间"
            ></a-date-picker>
        </a-form-model-item>
      </a-form-model>
      <a-table
        v-if="!single"
        row-key="id"
        size="small"
        :loading="tableLoading"
        :columns="columns"
        :data-source="increaseList"
      >
        <template #extractType="list, record, index">
          <a-select style="width: 150px" v-model="record.extractType" placeholder="请选择方式" @change="handleSelectExtractType($event, record)">
            <a-select-option :value="0">全量更新</a-select-option>
            <a-select-option :value="1" :disabled="modelType === 'hive' || tableType === 1">增量更新</a-select-option>
          </a-select>
        </template>
        <template #fieldList="list, record, index">
          <a-select v-if="record.extractType === 1" style="width: 150px" :default-value="list[0].name" placeholder="请选择字段" @change="handleSelectIncreaseFieldBatch($event, record)">
            <a-select-option v-for="item in list" :key="item.name" :value="item.name">{{ item.name }}</a-select-option>
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
    ellipsis: true,
    width: 200
  },
  {
    title: '抽取方式',
    dataIndex: 'extractType',
    scopedSlots: { customRender: 'extractType' }
  },
  {
    title: '增量字段',
    dataIndex: 'fieldList',
    scopedSlots: { customRender: 'fieldList' }
  }
]

export default {
  name: 'regularSetting',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    row: [Object, String],
    regularId: String,
    tableType: Number,
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
      tableLoading: false,
      form: {
        extractType: 0,
        incrementalColumn: undefined,
        incrementalType: '',
        name: undefined,
        repeat: undefined,
        interval: undefined,
        frequency: 0,
        gmtStart: undefined,
        gmtEnd: undefined
      },
      increaseList: [],
      errorState: 0, // 0.通过 1.小于系统时间 2.大于结束时间
      regData: {},
      increaseColRules: [{ required: true, message: '请选择增量字段' }],
      regRules: {
        name: [
          { required: true, message: '请输入任务名称' },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '请输入1-20个字符的任务名称'
          }
        ],
        repeat: [{ required: true, message: '请选择更新方式' }],
        gmtStart: [
          { required: true, message: '请选择开始时间' },
          {
            validator: this.gmtStartValidator,
            trigger: 'change'
          }
        ],
        gmtEnd: [
          {
            validator: this.gmtEndValidator,
            trigger: 'change'
          }
        ]
      },
      intervalRules: [
        { required: true, message: '请填写频率' },
        {
          validator: this.intervalValidator,
          trigger: 'change'
        }
      ],
      columns
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.dataAccess.modelName,
      modelType: state => state.dataAccess.modelType,
      modelId: state => state.dataAccess.modelId
    })
  },
  watch: {
    show(newValue, oldValue) {
      // 获取增量字段
      if (newValue) {
        let idList = []
        if (this.single) {
          idList.push(this.row.id)
        } else {
          idList = this.tableList.map(item => item.id)
        }
        this.tableLoading = true
        this.$server.dataAccess.getIncreaseFields(idList)
          .then(res => {
            if (res.code === 200) {
              let increaseList = []
              if (this.single) {
                increaseList.push({
                  id: this.row.id,
                  name: this.row.name,
                  extractType: 0,
                  incrementalType: '',
                  field: '',
                  fieldList: res.data[this.row.id]
                })
              } else {
                this.tableList.map(item => {
                  increaseList.push({
                    id: item.id,
                    name: item.name,
                    extractType: 0,
                    incrementalType: '',
                    field: '',
                    fieldList: res.data[item.id]
                  })
                })
              }
              this.increaseList = increaseList
              if (this.regularId) {
                this.$nextTick(() => {
                  this.handleGetRegularInfo(this.regularId)
                })
              }
            } else {
              this.$message.error(res.msg)
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
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
    handleGetRegularInfo(id) {
      this.spinning = true
      this.$server.dataAccess.getRegularInfo(id)
        .then(res => {
          if (res.code === 200) {
            this.regData = res.data
            for (const key in this.form) {
              this.$set(this.form, key, this.regData[key])
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    intervalValidator(rule, value, callback) {
      if (/^[1-9]\d*$/.test(value)) {
        if (this.form.frequency === 0 && (value * 1) < 30) {
          callback(new Error('间隔不得小于30分钟'))
        } else if (this.form.frequency === 0 && (value * 1) >= 60) {
          callback(new Error('间隔不得大于或等于60分钟'))
        } else if (this.form.frequency === 1 && (value * 1) >= 24) {
          callback(new Error('间隔不得大于或等于24小时'))
        } else if (this.form.frequency === 2 && (value * 1) >= 365) {
          callback(new Error('间隔不得大于或等于365'))
        } else if (this.form.frequency === 3 && (value * 1) >= 52) {
          callback(new Error('间隔不得大于或等于52周'))
        } else if (this.form.frequency === 4 && (value * 1) >= 12) {
          callback(new Error('间隔不得大于或等于12个月'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请填写正整数'))
      }
    },
    gmtStartValidator(rule, value, callback) {
      if (+new Date(value) < +new Date() + 60 * 1000) {
        this.errorState = 1
        callback(new Error('开始时间最早需设置在1分钟后'))
      } else if (value && this.form.gmtEnd && +new Date(this.form.gmtEnd) < +new Date(value)) {
        this.errorState = 2
        callback(new Error('结束时间不能小于开始时间'))
      } else {
        this.errorState = 0
        callback()
      }
    },
    // 自定义结束时间校验
    gmtEndValidator(rule, value, callback) {
      if (!value && this.errorState === 2) {
        this.$refs.form.clearValidate('gmtStart')
      }
      if (value && +new Date(value) < +new Date(this.form.gmtStart)) {
        callback(new Error('结束时间不能小于开始时间'))
      } else {
        callback()
      }
    },
    handleSelectFrequency() {
      this.$refs.form.validateField('interval')
    },
    handleSelectExtractType(value, record) {
      // 初始值
      if (value === 1) {
        record.field = record.fieldList[0].name
        record.incrementalType = record.fieldList[0].incrementalType
      }
    },
    // 选中增量字段, 同时要赋值增量字段类型
    handleSelectIncreaseField(value) {
      this.form.incrementalType = this.increaseList[0].fieldList.find(item => item.name === value).incrementalType
    },
    handleSelectIncreaseFieldBatch(value, record) {
      record.field = value
      record.incrementalType = record.fieldList.find(item => item.name === value).incrementalType
    },
    resetForm() {
      this.form = Object.assign({}, this.$options.data().form)
    },
    handleClose() {
      this.resetForm()
      this.$refs.form.clearValidate()
      this.$emit('close')
    },
    async handleAddRegularInfo() {
      // 传参
      if (this.tableType === 0) {
        let paramList = []
        this.increaseList.map(item => {
          const obj = {
            ...this.form,
            target: item.id,
            sourceId: this.modelId
          }
          // 批量时将form中的值替换成下面table的下拉框值
          if (!this.single) {
            obj.extractType = item.extractType
            obj.incrementalType = item.incrementalType
            obj.incrementalColumn = item.field
          }
          paramList.push(obj)
        })
        return this.$server.dataAccess.addRegularInfo(paramList)
          .finally(() => {
            this.loading = false
          })
      } else if (this.tableType === 1) {
        let paramList = []
        this.increaseList.map(item => {
          const obj = {
            ...this.form,
            target: item.id
          }
          paramList.push(obj)
        })
        return this.$server.dataAccess.addCustomRegularInfo(paramList)
          .finally(() => {
            this.loading = false
          })
      }
    },
    async handleUpdateRegularInfo() {
      if (this.tableType === 0) {
        return this.$server.dataAccess.putRegularInfo({
            ...this.form,
            id: this.regData.id,
            target: this.increaseList[0].id,
            sourceId: this.modelId
          })
          .finally(() => {
            this.loading = false
          })
      } else if (this.tableType === 1) {
        return this.$server.dataAccess.putCustomRegularInfo({
            ...this.form,
            id: this.regData.id,
            target: this.increaseList[0].id
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    handleOk() {
      this.$refs.form.validate(async (ok, obj) => {
        if (ok) {
          this.loading = true
          let res
          if (this.regularId) {
            res = await this.handleUpdateRegularInfo()
          } else {
            res = await this.handleAddRegularInfo()
          }
          if (res.code === 200) {
            this.$message.success('保存成功')
            if (this.single) {
              // 更新后重刷列表, 新增后直接插入(后端暂时支持这样)
              if (this.regularId) {
                this.$parent.$refs.extract.updateRows(res.data)
                // this.$emit('updateRows', res.data)
              } else {
                this.$parent.$refs.extract.regData.push(res.data)
              }
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

<style lang="less" scoped>
@deep: ~'>>>';
@{deep} .regular-bordered .ant-select-selection {
  border-color: #d9d9d9;
}
@{deep} .regular-bordered .ant-select-arrow {
  color: #d9d9d9;
}
@{deep} .ant-form-item-label {
  width: 100px !important;
}
</style>
