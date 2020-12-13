<template>
  <div class="tab-excel tab-datasource">
    <div class="tab-datasource-model scrollbar">
      <a-form-model
        ref="fileForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item label="数据源名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item :label="modelType + '文件'" required>
          <div
            class="excel-list scrollbar"
            ref="files"
            @dragenter.stop="fileDragEnter"
          >
            <div
              class="mask"
              v-show="isDragenter"
              @dragleave.stop="fileDragLeave"
              @dragover.stop.prevent
              @drop.stop="fileDrop"
            ></div>
            <template v-if="currentFileList.length > 0">
              <div
                class="excel-list-item"
                :class="{ active: currentFileIndex === index }"
                v-for="(item, index) in currentFileList"
                :key="item.id"
                :title="item.name"
                @click="handleGetDataBase(index)"
              >
                <div class="text">{{ item.name }}</div>
                <a-icon
                  slot="actions"
                  type="delete"
                  @click.stop="handleRemove(item)"
                ></a-icon>
              </div>
            </template>
            <a-empty style="margin-top:35px" v-else>
              <span slot="description">点击添加或将文件拖拽至此上传</span>
            </a-empty>
          </div>
          <a-upload
            name="file"
            :headers="{ 'content-type': 'multipart/form-data' }"
            :showUploadList="false"
            :before-upload="beforeFileUpload"
            @change="handleFileChange"
          >
            <a-button type="primary">
              添加文件
            </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="文件分隔符" prop="delimiter">
          <a-radio-group style="width:100%" v-model="form.delimiter" @change="changeDelimiter">
            <a-radio value="0">逗号</a-radio>
            <a-radio value="1">分号</a-radio>
            <a-radio value="2">空格</a-radio>
            <a-radio value="3">
              <span>其他</span>
              <div style="display:inline-block">
                <a-input
                  style="margin:0 10px;width: 200px;"
                  v-model="inputDelimiter"
                  :disabled="form.delimiter !== '3'"
                  @change="$refs.fileForm.validateField('delimiter')"
                />
              </div>
              <a-button
                v-show="form.delimiter === '3'"
                @click="handleRenderByDelimiter"
                type="primary">立即解析</a-button>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <a-row class="preview-list">
        <a-col style="margin-left:150px" :span="19">
          <!-- <div class="preview-controller">
            <span>从第</span>
            <div class="preview-line">
              <a-input style="width:60px" v-model="line" @keyup.enter.stop="handleEnterLine" />
              <div class="arrow-box" style="width:16px">
                <div class="arrow" @click="countLine('plus')">
                  <i class="arrow-up"></i>
                </div>
                <div class="arrow" @click="countLine('minus')">
                  <i class="arrow-down"></i>
                </div>
              </div>
            </div>
            <span>行开始获取数据</span>
            <a-checkbox style="margin-left: 50px" @change="handleCheckBox">自动生成列名</a-checkbox>
          </div> -->
          <div class="sheet-table scrollbar">
            <template v-if="currentFieldList.length > 0">
              <a-spin :spinning="spinning">
                <table>
                  <thead class="sheet-head">
                    <tr style="border: none"><th v-for="item in currentColumns" :key="item.dataIndex"><div class="cell-item">{{ item.title }}</div></th></tr>
                  </thead>
                  <tbody class="sheet-body scrollbar">
                    <tr v-for="(item, index) in currentFieldList" :key="item.key">
                      <td><div class="cell-item">{{ index + 1 }}</div></td>
                      <td v-for="col in currentColumns.slice(1)" :key="col.dataIndex"><div class="cell-item">{{ item[col.dataIndex] }}</div></td>
                    </tr>
                  </tbody>
                </table>
              </a-spin>
            </template>
            <a-empty style="margin: 20px 0" v-else></a-empty>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-button
      type="primary"
      class="btn_sub"
      @click="handleSaveForm"
      :loading="loading"
    >
      保存
    </a-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Excel from './excel'

export default {
  name: 'model-csv',
  extends: Excel,
  data() {
    return {
      loading: false,
      spinning: false,
      isDragenter: false,
      form: {
        name: '',
        delimiter: '0'
      },
      inputDelimiter: '',
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
            message: '长度为1~20'
          }
        ],
        delimiter: [ { validator: this.delimiterValidate } ]
      },
      labelCol: {
        span: 4
      },
      fileList: [], // 文件列表
      fileInfoList: [], // 编辑时获取的文件信息
      deleteIdList: [], // 删除的文件列表
      databaseList: [], // 文件对应数据库列表
      currentFileIndex: 0, // 当前选中文件
      isSetTableHead: false, // 是否自动生成列名(暂无该需求)
      line: 1, // 当前显示的首行(暂无该需求)
      requestLine: 1, // 记录上次设置的首行(暂无该需求)
      columns: [], // 表头数据
      noTitleColumns: [], // 自动生成表头时的表头(暂无该需求)
      currentColumns: [], // 当前显示的表头
      fieldList: [], // 列表数据
      noTitleFieldList: [], // 自动生成表头时的列表(暂无该需求)
      currentFieldList: [] // 当前显示的列表
    }
  },
  computed: {
    queryDelimiter() {
      switch (this.form.delimiter) {
        case '0':
         return ','
        case '1':
         return ';'
        case '2':
         return ' '
        case '3':
         return this.inputDelimiter
        default:
           return ','
      }
    }
  },
  methods: {
    delimiterValidate(rule, value, callback) {
      if (value === '3' && !this.inputDelimiter) {
        callback(new Error('请填写分隔符'))
      } else {
        callback()
      }
    },
    // 重置表单
    handleResetForm() {
      this.form = { name: '', delimiter: '0' }
      this.fileList = []
      this.fileInfoList = []
      this.databaseList = []
      this.handleClearTable()
    },
    // 清空当前表格内容
    handleClearTable() {
      this.currentColumns = []
      this.currentFieldList = []
      this.deleteIdList = []
    },
    // 渲染表单
    handleSetFormData() {
      if (this.modelType !== 'csv') return
      this.handleResetForm()
      if (this.modelId) { // 有id就是编辑状态
        this.$set(this.form, 'name', this.modelName)
        let delimiter = this.modelInfo.delimiter
        if (delimiter === ',') {
          this.$set(this.form, 'delimiter', '0')
        } else if (delimiter === ';') {
          this.$set(this.form, 'delimiter', '1')
        } else if (delimiter === ' ') {
          this.$set(this.form, 'delimiter', '2')
        } else {
          this.$set(this.form, 'delimiter', '3')
          this.inputDelimiter = delimiter
        }
        this.getFileList()
      }
    },
    changeDelimiter(e) {
      const value = e.target.value
      if (value === '3' && !this.inputDelimiter) {
        return this.handleClearTable()
      } else {
        this.databaseList = []
        this.$nextTick(() => {
          this.renderCurrentTable()
        })
      }
    },
    handleRenderByDelimiter() {
      if (this.inputDelimiter) {
        this.databaseList = []
        this.$nextTick(() => {
          this.renderCurrentTable()
        })
      }
    },
    getFileList() {
      this.spinning = true
      this.$server.dataAccess.getModelFileList(this.modelId)
        .then(res => {
          this.fileInfoList = res.rows
          // 默认第一个
          this.handleGetDataBase(0)
        })
    },
    // 获取当前文件对应的数据库信息
    async handleGetDataBase(index) {
      if (index < 0) {
        this.currentColumns = []
        this.currentFieldList = []
        this.$store.dispatch('dataAccess/setFirstFinished', false)
      } else {
        this.currentFileIndex = index
        this.renderCurrentTable()
        this.$store.dispatch('dataAccess/setDatabaseName', this.fileInfoList[index].name)
      }
    },
    // 删除文件
    handleRemove(file) {
      this.$confirm({
        title: '确认提示',
        content: '您确定要删除该文件吗',
        onOk: () => {
          let index = this.currentFileList.indexOf(file)
          this.databaseList.splice(index, 1)
          this.fileInfoList.splice(index, 1)
          this.deleteIdList.push(file.id)
          // 遍历新增的文件列表, 如果有就删除对象
          for (let i = 0; i < this.fileList.length; i++) {
            const item = this.fileList[i]
            if (item.id === file.id) {
              this.fileList.splice(i, 1)
              break
            }
          }
          this.handleGetDataBase(this.currentFileList.length - 1)
        }
      })
    },
    // 处理拖动区域样式
    fileDragEnter(e) {
      const classList = this.$refs.files.classList
      if (!classList.contains('drag')) {
        this.isDragenter = true
        classList.add('drag')
      }
    },
    // 处理拖动区域样式
    fileDragLeave(e) {
      const classList = this.$refs.files.classList
      if (classList.contains('drag')) {
        this.isDragenter = false
        classList.remove('drag')
      }
    },
    fileDrop(e) {
      this.isDragenter = false
      this.$refs.files.classList.remove('drag')
      const fileList = [...e.dataTransfer.files]
      if (fileList.length > 1) {
        return this.$message.error('一次只能上传一个文件')
      }
      fileList.map(file => {
        this.fileValidate(file)
      })
      e.preventDefault()
    },
    // 手动上传文件
    beforeFileUpload() {
      return false
    },
    // 上传文件
    handleFileChange(e) {
      this.fileValidate(e.file)
    },
    // 校验文件
    fileValidate(file) {
      if (this.currentFileList.length > 0) {
        return this.$message.error('只支持上传一个文件')
      }
      // 校验大小
      if (file.size > 1 * 1024 * 1024) return this.$message.error('文件大于1M, 无法上传')

      let name = file.name
      // 校验重名
      if (this.currentFileList.some(file => file.name === name.slice(0, name.lastIndexOf('.')))) {
        return this.$message.error('文件命名重复, 请重新添加')
      }

      if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(name)) {
        return this.$message.error('暂不支持中文文件')
      }

      // 校验csv文件类型
      const fileType = name.slice(name.lastIndexOf('.') + 1, name.length)
      if (/csv/.test(fileType)) {
        file.id = file.uid || 'vc-upload-' + (+new Date())
        this.actionUploadFile(file)
      } else {
        this.$message.error(name + '不是csv文件')
      }
    },
    // 是否自动生成表头
    handleCheckBox(e) {
      const checked = e.target.checked
      if (this.isSetTableHead === checked) return
      this.isSetTableHead = checked
      if (checked) {
        this.currentColumns = this.noTitleColumns
        this.currentFieldList = this.noTitleFieldList
      } else {
        this.currentColumns = this.columns
        this.currentFieldList = this.fieldList
      }
      this.$nextTick(() => {
        this.handleChangeFieldList()
      })
    },
    // 箭头设置首行数
    countLine(type) {
      if (type === 'plus') {
        if (++this.line > 1000) {
          this.line = 1000
        } else {
          this.requestLine = this.line
          this.handleChangeFieldList()
        }
      } else if (type === 'minus') {
        if (--this.line < 1) {
          this.line = 1
        } else {
          this.requestLine = this.line
          this.handleChangeFieldList()
        }
      }
    },
    // 回车设置首行
    handleEnterLine(e) {
      const value = e.target.value
      if (!isNaN(value) && value >= 1 && value <= 1000) {
        this.line = value
        this.requestLine = value
        this.handleChangeFieldList()
      } else {
        this.line = this.requestLine
      }
    },
    // 处理表头
    handleChangeFieldList() {
      const currentFieldList = this.isSetTableHead ? this.noTitleFieldList : this.fieldList
      this.currentColumns = this.isSetTableHead ? this.noTitleColumns : this.columns
      this.currentFieldList = currentFieldList.slice(this.requestLine - 1)
      this.spinning = false
    },
    // 读取未上传的文件
    async readUnUploadFile(id) {
      const formData = new FormData()
      this.fileList.map(item => {
        if (item.id === id) {
          formData.append('csvFile', item)
          formData.append('delimiter', this.queryDelimiter)
        }
      })
      this.spinning = true
      const result = await this.$server.dataAccess.actionUploadCsvFile(formData)
      if (result.code === 200) {
        this.$set(this.databaseList, this.currentFileIndex, result.rows[0].tableContent)
        this.$nextTick(() => {
          this.renderCurrentTable()
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    // 上传文件
    async actionUploadFile(file) {
      const formData = new FormData()
      formData.append('csvFile', file)
      formData.append('delimiter', this.queryDelimiter)
      this.spinning = true
      const result = await this.$server.dataAccess.actionUploadCsvFile(formData)
      if (result.code === 200) {
        this.$message.success('解析成功')
        this.fileList.push(file)

        const fileInfo = {
          id: file.id,
          name: file.name
        }
        const name = fileInfo.name
        fileInfo.name = name.slice(0, name.lastIndexOf('.'))
        this.fileInfoList.push(fileInfo)

        const currentIndex = this.currentFileList.length - 1
        const database = result.rows[0].tableContent
        this.$set(this.databaseList, currentIndex, database)
        this.handleGetDataBase(currentIndex)
      } else {
        this.$message.error(result.msg)
      }
    },
    // 渲染当前表格
    async renderCurrentTable() {
      // 写入表头信息
      let index = this.currentFileIndex
      let table = this.databaseList[index]
      // debugger
      // 判断是否处理过表格信息(处理之后的是Array类型), 没有则调接口获取信息并处理
      if (!Array.isArray(table)) {
        const formData = new FormData()
        const id = this.fileInfoList[index].id
        let res
        if (isNaN(id)) {
          return this.readUnUploadFile(id)
        } else {
          formData.append('databaseId', id)
          formData.append('delimiter', this.queryDelimiter)
          res = await this.$server.dataAccess.getCsvFileTableInfo(formData)
        }
        if (res.code === 200) {
          table = res.rows[0].tableContent
          this.$set(this.databaseList, index, table)
        } else {
          return this.$message.error('获取内容失败')
        }
      }
      const columns = new Array({
          title: '序号',
          dataIndex: 'no',
          scopedSlots: {
            customRender: 'no'
          }
        }).concat(table[0].map((col, index) => {
          return {
            title: col,
            dataIndex: index + ''
          }
        }))

      this.columns = columns
      this.noTitleColumns = columns.map((item, index) => {
        if (index === 0) {
          return item
        } else {
          return {
            title: 'F' + (index - 1),
            dataIndex: item.dataIndex
          }
        }
      })

      // 写入表信息
      const tableData = table.slice(1).map((item, index) => {
        const data = { key: index + '' }
        if (Array.isArray(item)) {
          item.map((value, key) => {
            data[key + ''] = value
          })
        } else {
          columns.slice(1).map((col, index) => {
            data[col.dataIndex] = item[col.title]
          })
        }
        return data
      })
      const head = {}
      columns.map(item => {
        head[item.dataIndex] = item.title
      })
      this.fieldList = tableData
      this.noTitleFieldList = new Array(head).concat(tableData)

      this.$nextTick(() => {
        this.handleChangeFieldList()
      })
    },
    handleSaveForm() {
      if (this.currentFileList.length > 1) {
        return this.$message.error('只支持上传一个文件')
      } else if (this.currentFileList.length === 0) {
        return this.$message.error('请上传文件')
      }
      this.$refs.fileForm.validate((pass, obj) => {
        this.loading = true
        if (pass) {
          this.loading = true
          const formData = new FormData()
          this.fileList.map((file, index) => {
            formData.append('fileList[' + index + ']', file)
          })
          this.deleteIdList.map((id, index) => {
            formData.append('delDatabasesIdList[' + index + ']', id)
          })
          formData.append('delimiter', this.queryDelimiter)
          formData.append('sourceSaveInput.name', this.form.name)
          formData.append('sourceSaveInput.type', 5)
          formData.append('sourceSaveInput.parentId', this.parentId || 0)
          formData.append('sourceSaveInput.id', this.modelId || 0)
          if (this.deleteIdList.length > 0 || this.fileList.length > 0) {
            formData.append('isFileListChange', 1)
          } else {
            formData.append('isFileListChange', 0)
          }

          this.$server.dataAccess.saveCsvInfo(formData)
            .then(result => {
              console.log(result)
              if (result.code === 200) {
                this.$message.success('保存成功')
                this.$store.dispatch('dataAccess/getMenuList')
                this.$store.dispatch('dataAccess/setFirstFinished', true)
                this.$store.dispatch('dataAccess/setModelName', this.form.name)
                this.$store.dispatch('dataAccess/setModelId', result.data.datasourceId)
                this.$store.dispatch('dataAccess/setParentId', 0)
                // 保存后清空列表
                this.fileList = []
              } else {
                this.$message.error(result.msg)
              }
              this.loading = false
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './read-file-table';
</style>
