<template>
  <a-modal :title="single ? '定时设置' : '批量抽取设置'" :bodyStyle="bodyStyle" :visible="show" @cancel="handleClose" @ok="handleOk">
    <!-- <a-form-model v-if="single" ref="form" :model="form"  :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item label="抽取方式" prop="extractType">
        <a-radio-group style="width:100%" v-model="form.extractType">
          <a-radio value="0">
            <span>全量覆盖抽取</span>
            <a-popover>
              <template slot="content">
                每次抽取，对数据库的全部数据进行抽取，并覆盖数据库全部已有的数据
              </template>
              <a-icon style="margin-left:10px" type="question-circle" theme="outlined" />
            </a-popover>
          </a-radio>
          <a-radio value="1">
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
      <a-form-model-item label="抽取依据字段" prop="id">
        <a-select v-model="form.id" placeholder="请选择依据字段">
          <a-select-option value="1">1</a-select-option>
          <a-select-option value="2">2</a-select-option>
          <a-select-option value="3">3</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model> -->
    <div style="margin-bottom:10px"><a-button type="primary" @click="setRegular">添加定时任务</a-button></div>
    <a-table
      rowKey='id'
      size="small"
      :columns="regColumns"
      :data-source="regData"
      :loading="modalSpin"
      :pagination='false'
    >
      <span slot="repeat" slot-scope="type">
        {{ type === 0 ? '只执行一次' : '重复执行' }}
      </span>
      <span slot="config" slot-scope="row">
        <a style="margin-right: 20px" v-on:click="handleRegular(row, 'edit')">编辑</a>
        <a v-on:click="handleRegular(row, 'delete')">删除</a>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'

const regColumns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '执行频率',
    dataIndex: 'repeat',
    key: 'repeat',
    scopedSlots: { customRender: 'repeat' }
  },
  {
    title: '开始时间',
    dataIndex: 'gmtStart',
    key: 'gmtStart',
    scopedSlots: { customRender: 'gmtStart' }
  },
  {
    title: '操作',
    key: 'config',
    scopedSlots: { customRender: 'config' }
  }
]

export default {
  name: 'extractSetting',
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
    formData: [Object, String]
  },
  data() {
    return {
      bodyStyle: { 'maxHeight': 'calc(100vh - 240px)', 'overflow-y': 'auto' },
      modalSpin: false,
      showTable: false,
      regularForm: '',
      form: {
        extractType: undefined,
        id: undefined
      },
      rules: {
        extractType: [
          { required: true, message: '请选择抽取方式', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请选择依据字段', trigger: 'change' }
        ]
      },
      regData: [],
      regColumns
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.dataAccess.modelName,
      modelId: state => state.dataAccess.modelId
    }),
    regularData() {
      return this.selectedRows.length > 0 ? this.selectedRows : this.data
    }
  },
  watch: {
    show(newValue, oldValue) {
      // if (newValue && typeof this.formData === 'object') {
      //   const newForm = {}
      //   for (const key in this.form) {
      //     if (key === 'freqType' && !this.formData[key]) {
      //       newForm[key] = '1'
      //     } else {
      //       newForm[key] = this.formData[key]
      //     }
      //   }
      //   this.form = newForm
      //   console.log(this.form)
      // }
      if (newValue) {
        this.handleGetRegularList()
      }
    }
  },
  methods: {
    setRegular() {
      this.$emit('setRegular')
    },
    async handleGetRegularList() {
      const res = await this.$server.dataAccess.getRegularList({
        target: this.row.id
      })
      if (res.code === 200) {
        console.log(res)
        this.regData = res.rows
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    updateRows(row) {
      this.regData.map((item, index) => {
        if (item.id === row.id) {
          this.$set(this.regData, index, row)
        }
      })
    },
    handleRegular(row, type) {
      console.log('row', row)
      if (type === 'edit') {
        this.$emit('setRegular', row)
      } else if (type === 'delete') {
        this.$confirm({
          title: '确认提示',
          content: '确定要删除该任务吗',
          onOk: () => {
            const id = row.id
            this.$server.dataAccess.deleRegularInfo(id)
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('删除成功')
                  for (let i = 0; i < this.regData.length; i++) {
                    const item = this.regData[i]
                    if (item.id === id) {
                      this.regData.splice(i, 1)
                      break
                    }
                  }
                } else {
                  this.$message.error(res.msg)
                }
              })
          }
        })
      }
    },
    closeRegular() {
      this.visible2 = false
      this.showTable = false
    },
    handleClose() {
      this.$emit('close')
    },
    handleSave() {
      console.log('save')
      this.handleClose()
    },
    handleOk() {
      // if (this.single) {
      //   this.$refs.form.validate((ok, obj) => {
      //     if (ok) {
      //       this.handleSave()
      //     }
      //   })
      // } else {
      //   this.handleSave()
      // }
      this.handleSave()
    }
  }
}
</script>

<style>

</style>
