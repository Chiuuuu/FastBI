<template>
  <div>
    <a-empty
      v-if="!modelType"
      class="tab-empty"
      :image="emptyImgUrl"
      :image-style="{
        height: '210px'
      }"
    >
      <span slot="description"> 请在左侧新建或选择数据连接</span>
    </a-empty>
    <template v-else>
      <div v-if="isFileType">
        <div class="tab-excel">
          <a-form-model
            ref="fileForm"
            :model="form"
            :rules="rule"
            :label-col="labelCol"
          >
            <a-form-model-item label="数据源名称" prop="Data">
              <a-input style="width:528px;" />
            </a-form-model-item>
            <a-form-model-item label="Execl文件" prop="File">
              <a-button
                style="border-color:rgba(97, 123, 255, 1);"
                @click="select"
              >
                选择文件
              </a-button>
              <div class="excel-list" v-if="excel">
                <a-list item-layout="horizontal" :data-source="d">
                  <a-list-item slot="renderItem" style="margin-left:10px">
                    <a-list-item-meta description="XXX.xlsx">
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </div>
            </a-form-model-item>
            <a-form-model-item label="保存目录" prop="Catalog">
              <a-select default-value="数据连接目录" style="width: 535px">
                <a-select-option value="电视统计">
                  电视统计
                </a-select-option>
                <a-select-option value="用户统计">
                  用户统计
                </a-select-option>
                <a-select-option value="流失统计">
                  流失统计
                </a-select-option>
                <a-select-option value="收入统计">
                  收入统计
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div v-else>
        <div class="tab-datasource">
          <a-form-model
            ref="dbForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            @validate="handleValidateFiled"
          >
            <a-form-model-item label="数据源名称" prop="name">
              <a-input
                style="width:528px;"
                v-model="form.name"
                @change="handleSetTableName"
              />
            </a-form-model-item>
            <a-form-model-item label="服务器" prop="ip">
              <a-input style="width:528px;" v-model="form.ip" />
            </a-form-model-item>
            <a-form-model-item label="端口" prop="port">
              <a-input style="width:528px;" v-model.number="form.port" />
            </a-form-model-item>
            <a-form-model-item label="用户名" prop="username">
              <a-input style="width:528px;" v-model="form.username" />
            </a-form-model-item>
            <a-form-model-item label="密码" prop="password">
              <a-input-password style="width:528px;" v-model="form.password" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button
                :loading="connectBtn"
                type="primary"
                style="width:88px;height:30px"
                @click="handleConnect"
              >
                连接
              </a-button>
            </a-form-model-item>
            <a-form-model-item
              label="默认连接库"
              prop="dbid"
              v-if="connectStatus"
            >
              <a-select
                style="width: 528px"
                v-model="form.dbid"
                @change="handleDefaultDbSelect"
              >
                <a-select-option
                  v-for="item in databaseList"
                  :value="item.id"
                  :key="item.id"
                >
                  {{ item.databaseName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
        </div>
        <a-button
          type="primary"
          class="btn_sub"
          @click="handleSaveForm"
          :disabled="!connectStatus"
          :loading="saveBtn"
        >
          保存
        </a-button>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import emptry from '../../../../../../assets/images/icon_empty_state.png'
import {
  fetchConnect,
  fetchGetDBList,
  fetchSave
} from '../../../../../../api/dataAccess/api'
export default {
  name: 'tabContentEntry',
  data() {
    let validateIP = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入服务器ip地址'))
      } else {
        var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        var bl = re.test(value)
        if (!bl) {
          callback(new Error('ip地址格式错误'))
        }
        callback()
      }
    }
    return {
      emptyImgUrl: emptry, // 空状态
      labelCol: { span: 4 },
      form: {
        // 连接信息表单
        name: '', // 数据库名
        ip: '', // 服务器ip
        port: '', // 端口号
        username: '', // 用户名
        password: '', // 密码
        dbid: '', // 默认数据库id
        databaseName: '' // 默认数据库名称
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入数据源名称'
          },
          {
            type: 'string',
            max: 20,
            min: 1,
            message: '五个'
          }
        ],
        ip: [
          {
            required: true,
            message: '请输入服务器ip地址'
          },
          {
            validator: validateIP,
            trigger: 'blur'
          }
        ],
        port: [
          { required: true, message: '请输入端口号' },
          { type: 'integer', message: '请输入数字', min: 0 }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          }
        ],
        dbid: [
          {
            required: true
          }
        ]
      },
      connectBtn: false,
      connectStatus: false, // 是否连接
      saveBtn: false,
      databaseList: [],
      excel: false,
      rule: {
        Data: [
          {
            required: true,
            message: '请输入数据源名称'
          }
        ],
        File: [
          {
            required: true,
            message: '请选择文件'
          }
        ],
        Catalog: [
          {
            required: true,
            message: '请选择保存目录'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      modelInfo: state => state.dataAccess.modelInfo,
      tableList: state => state.dataAccess.menuList,
      modelType: state => state.dataAccess.modelType, // 数据类型
      modelSelectType: state => state.dataAccess.modelSelectType,
      isFileType(state) {
        // 数据类型是否是文件格式
        return ['execl', 'csv'].some(function(item) {
          return item === state.dataAccess.modelType
        })
      },
      tabChangeAble: state => state.dataAccess.firstFinished // 是否完成第一部分
    })
  },
  created() {
    this.$EventBus.$on('setFormData', this.handleSetFormData)
    this.$EventBus.$on('resetForm', this.handleResetForm)
    // this.$EventBus.$on('fetchFormData', th)
  },
  beforeDestroy() {
    this.$EventBus.$off('resetForm', this.handleResetForm)
    this.$EventBus.$off('setFormData', this.handleSetFormData)
  },
  mounted() {
    console.log('main-table', this.tableList)
  },
  methods: {
    handleSetFormData() {
      this.form = Object.assign(this.form, this.modelInfo)
      this.connectStatus = false
    },
    /**
     * 任一表单项被校验后触发
     * prop 字段名称
     * result 是否校验成功
     * err 错误信息
     */
    handleValidateFiled(prop, result, err) {
      if (!result) {
        this.connectStatus = false
        this.$emit('on-set-tab', '1')
        this.$store.dispatch('dataAccess/setFirstFinished', false)
      }
    },
    /**
     * 设置表单名称
     */
    handleSetTableName() {
      console.log('emit')
      this.$emit('on-set-table-name', this.form.name)
    },
    /**
     * 默认选择数据库操作
     * value 选中的id值
     */
    handleDefaultDbSelect(value) {
      console.log('defaultmodel', value)
      const item = this.databaseList.filter(item => {
        return item.id === value && item
      })
      const obj = item.pop()
      this.form.dbid = obj.id
      this.form.databaseName = obj.databaseName
      this.$store.dispatch('dataAccess/setModelInfo', this.form)
    },
    /**
     * 重置表单
     */
    handleResetForm() {
      this.$refs['dbForm'] && this.$refs.dbForm.resetFields()
      this.connectStatus = false
    },
    /**
     * 连接数据库
     */
    handleConnect() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          this.connectBtn = true
          const result = await fetchConnect({
            url: '/admin/dev-api/system/mysql/connect',
            data: {
              ip: this.form.ip,
              name: this.form.name,
              password: this.form.password,
              port: this.form.port,
              username: this.form.username
            }
          }).finally(() => {
            this.connectBtn = false
          })

          if (result.data.code === 200) {
            console.log(result.data)
            this.databaseList = [].concat(result.data.rows)
            // 设置默认选中第一个
            console.log('请求获取数据库列表')
            this.form.dbid = this.databaseList[0].id
            this.form.databaseName = this.databaseList[0].name
            this.connectStatus = true
          } else {
            this.$message.warning(result.data.msg)
          }
        } else {
          this.connectStatus = false
          return false
        }
      })
    },
    /**
     * 保存数据表
     */
    handleSaveForm() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          const datadbitem = this.databaseList
            .filter(item => item.id === this.form.dbid)
            .pop()
          this.form = Object.assign(this.form, {
            databaseName: datadbitem.databaseName
          })
          console.log(this.form)

          this.saveBtn = true
          const result = await fetchSave({
            url: '/admin/dev-api/system/mysql/save',
            data: this.modelSelectType === 'new' ? Object.assign(this.form, {
              parentId: -1,
              id: this.$store.state.dataAccess.modelId
            }) : Object.assign(this.form, {
              id: this.$store.state.dataAccess.modelId
            })
          }).finally(() => {
            this.saveBtn = false
          })

          if (result.data.code === 200) {
            this.$store.dispatch('dataAccess/getMenuList')
            this.$store.dispatch('dataAccess/setFirstFinished', true)
            this.$store.dispatch('dataAccess/setModelInfo', this.form)
            this.$store.dispatch('dataAccess/setModelId', result.data.data)
            // this.tableList.push({
            //   id: this.tableList.length + 1,
            //   name: this.form.name
            // })
          } else {
            this.$message.error(result.data.msg)
          }
          console.log(result)
        } else {
          return false
        }
      })
    },
    select(excel) {
      this.excel = !this.excel
    }
  }
}
</script>
