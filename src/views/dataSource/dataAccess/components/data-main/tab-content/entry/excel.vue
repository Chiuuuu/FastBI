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
          <a-input placeholder="请输入数据源名称" v-model="form.name" @change="handleSetTableName" />
        </a-form-model-item>
        <a-form-model-item label="Excel文件" required>
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
                <div>
                  <a-icon type="retweet" style="margin-right:10px" @click.stop="handleReplaceFile(item, index)" />
                  <a-icon type="delete" @click.stop="handleRemove(item)"></a-icon>
                </div>
              </div>
            </template>
            <a-empty style="margin-top:35px" v-else>
              <span slot="description">点击添加或将文件拖拽至此上传</span>
            </a-empty>
          </div>
          <a-upload
            accept=".xlsx, .xls"
            name="file"
            :headers="{ 'content-type': 'multipart/form-data' }"
            :showUploadList="false"
            :before-upload="beforeFileUpload"
            @change="handleFileChange"
          >
            <a-button ref="uploader" type="primary" :loading="loading">
              添加文件
            </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <a-row class="preview-list">
        <a-col :span="4" style="height:100%;width: 150px">
          <div class="preview-tab">
            <div class="tab-title">Sheet子表</div>
            <ul>
              <li
                class="preview-tab-item"
                :title="sheet.name"
                :class="{ 'active': currentSheetIndex === index }"
                v-for="(sheet, index) in sheetList"
                :key="index"
                @click="handleChangeTab(sheet, index)"
              >{{ sheet.name }}</li>
            </ul>
          </div>
        </a-col>
        <a-col :span="19" style="height:100%">
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
      v-if="hasPermission"
    >
      保存
    </a-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MapSheet } from '../util'
import { hasPermission } from '@/utils/permission'
export default {
  name: 'model-excel',
  data() {
    return {
      btnPermission: [this.$PERMISSION_CODE.OPERATOR.edit, this.$PERMISSION_CODE.OPERATOR.add],
      loading: false,
      spinning: false,
      isDragenter: false,
      form: {
        name: ''
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
            message: '长度为1~20'
          }
        ]
      },
      labelCol: {
        span: 4
      },
      fileList: [], // 文件列表
      fileInfoList: [], // 编辑时获取的文件信息
      deleteIdList: [], // 删除的文件列表
      databaseList: [], // 文件对应数据库列表
      currentSheetIndex: 0, // 当前选中sheet
      currentFileIndex: 0, // 当前选中文件
      isSetTableHead: false, // 是否自动生成列名(暂无该需求)
      line: 1, // 当前显示的首行(暂无该需求)
      requestLine: 1, // 记录上次设置的首行(暂无该需求)
      columns: [], // 表头数据
      noTitleColumns: [], // 自动生成表头时的表头(暂无该需求)
      currentColumns: [], // 当前显示的表头
      fieldList: [], // 列表数据
      noTitleFieldList: [], // 自动生成表头时的列表(暂无该需求)
      currentFieldList: [], // 当前显示的列表
      replaceFile: {
        isReplace: false, // 是否在进行文件替换操作
        index: -1, // 被替换的文件索引
        info: null // 被替换的文件详情
      }
    }
  },
  computed: {
    ...mapState({
      parentId: state => state.dataAccess.parentId,
      modelId: state => state.dataAccess.modelId,
      modelName: state => state.dataAccess.modelName,
      modelInfo: state => state.dataAccess.modelInfo,
      modelFileList: state => state.dataAccess.modelFileList,
      modelType: state => state.dataAccess.modelType,
      privileges: state => state.common.privileges,
      databaseName: state => state.dataAccess.databaseName
    }),
    currentFileList() {
      // return this.fileInfoList.length > 0 ? this.fileInfoList : this.fileList
      return this.fileInfoList
    },
    currentDataBase() {
      return this.databaseList[this.currentFileIndex] || {}
    },
    sheetList() { // 当前文件的sheet列表
      return this.currentDataBase.sheetList || []
    },
    tableList() { // sheet表格数据
      return this.currentDataBase.tableList || []
    },
    hasPermission() {
      return hasPermission(this.privileges, this.$PERMISSION_CODE.OPERATOR.edit)
    }
  },
  watch: {
    modelName(newValue, oldValue) {
      this.form.name = newValue
    }
  },
  mounted() {
    this.$EventBus.$on('setFormData', this.handleSetFormData)
    this.$EventBus.$on('resetForm', this.handleResetForm)
  },
  beforeDestroy() {
    this.handleClearTable()
    this.$EventBus.$off('setFormData', this.handleSetFormData)
    this.$EventBus.$off('resetForm', this.handleResetForm)
  },
  methods: {
    handleChangeTab(sheet, index) {
      if (this.loading) return
      this.currentSheetIndex = index
      this.renderCurrentTable(index)
    },
    // 重置表单
    handleResetForm() {
      this.form = { name: '' }
      this.fileList = []
      this.fileInfoList = []
      this.databaseList = []
      this.handleClearTable()
    },
    /**
     * 设置表单名称
     */
    handleSetTableName() {
      this.$emit('on-set-table-name', this.form.name)
    },
    // 清空当前表格内容
    handleClearTable() {
      this.currentColumns = []
      this.currentFieldList = []
      this.deleteIdList = []
    },
    // 渲染表单
    handleSetFormData() {
      if (this.modelType !== 'excel') return
      this.handleResetForm()
      if (this.modelId) { // 有id就是编辑状态
        this.$set(this.form, 'name', this.modelName)
        this.getFileList()
      }
    },
    getFileList() {
      this.spinning = true
      this.$server.dataAccess.getModelFileList(this.modelId)
        .then(res => {
          this.fileInfoList = res.rows
          const name = this.modelInfo ? this.modelInfo.databaseName : ''

          // 默认第一个
          let index = 0
          for (let i = 0; i < res.rows.length; i++) {
            const item = res.rows[i]
            if (name === item.name) {
              index = i
            }
          }
          this.$nextTick(() => {
            this.handleGetDataBase(index)
          })
        })
        .catch(() => {
          this.spinning = false
        })
    },
    // 获取当前文件对应的数据库信息
    async handleGetDataBase(index) {
      if (this.loading) return
      this.currentSheetIndex = 0
      if (index < 0) {
        this.currentColumns = []
        this.currentFieldList = []
        this.$store.dispatch('dataAccess/setFirstFinished', false)
      } else {
        this.currentFileIndex = index
        let database = this.databaseList[index]
        if (!database) { // 不存在当前数据库, 调接口查询并写入
          if (!this.fileInfoList[index]) return
          this.spinning = true
          const res = await this.$server.dataAccess.getFileSheetList(this.fileInfoList[index].id)
            .catch(() => {
              this.spinning = false
            })
          if (res.code === 200) {
            database = new MapSheet(res.rows)
            this.$set(this.databaseList, index, database)
          } else {
            this.$message.error('获取表格失败')
          }
        }
        this.$store.dispatch('dataAccess/setDatabaseName', this.fileInfoList[index].name)
        this.renderCurrentTable(0)
      }
    },
    // 清空替换文件
    clearReplaceFile() {
      this.replaceFile = {
        isReplace: false,
        index: -1,
        info: null
      }
    },
    // 替换文件
    handleReplaceFile(file, index) {
      if (this.loading) return
      this.replaceFile = {
        isReplace: true,
        index: index,
        info: file
      }
      this.$refs.uploader.$el.click()
    },
    // 删除文件
    handleRemove(file) {
      if (this.loading) return
      this.$confirm({
        title: '确认提示',
        content: '您确定要删除该文件吗',
        onOk: () => {
          let index = this.currentFileList.indexOf(file)
          this.databaseList.splice(index, 1)
          this.fileInfoList.splice(index, 1)
          // 如果删除当前被替换的文件, 清空替换文件对象
          if (this.replaceFile.index > -1 && file.id === this.replaceFile.info.id) {
            this.clearReplaceFile()
          }
          // 遍历新增的文件列表, 如果有就删除对象
          let isNewFile = false
          for (let i = 0; i < this.fileList.length; i++) {
            const item = this.fileList[i]
            if (item.id === file.id) {
              isNewFile = true
              this.fileList.splice(i, 1)
              break
            }
          }
          if (!isNewFile) {
            this.deleteIdList.push(file.id)
          }
          this.$nextTick(() => {
            this.handleGetDataBase(this.currentFileList.length - 1)
          })
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
      let isValid = true

      // 校验替换时的文件名
      let name = file.name
      name = name.slice(0, name.lastIndexOf('.'))
      if (this.replaceFile.isReplace && this.replaceFile.info.name !== name) {
        this.$message.error('替换的文件名称不一致')
        isValid = false
      }

      if (isValid && this.currentFileList.length > 0 && !this.replaceFile.isReplace) {
        this.$message.error('只支持上传一个文件')
        isValid = false
      }
      // 校验大小
      if (isValid && file.size > 3 * 1024 * 1024) {
        isValid = false
        this.$message.error('文件大于3M, 无法上传')
      }

      // 校验命名规则(中英数字下划线)
      if (isValid && !/^[0-9a-zA-Z_\u4E00-\u9FA5\uF900-\uFA2D]*$/g.test(name)) {
        isValid = false
        this.$message.error('命名存在非法字符')
      }

      // 校验重名
      if (isValid && !this.replaceFile.isReplace && this.fileInfoList.some(file => file.name === name)) {
        isValid = false
        this.$message.error('文件命名重复, 请重新添加')
      }
      if (!isValid) {
        this.clearReplaceFile()
        return
      }
      // 校验excel文件类型
      const fileType = file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length)
      if (/xls|xlsx/.test(fileType)) {
        file.id = file.uid || 'vc-upload-' + (+new Date())
        if (this.replaceFile.isReplace) {
          this.actionReplaceFile(file)
        } else {
          this.actionUploadFile(file)
        }
      } else {
        this.$message.error(name + '不是excel文件')
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
    // 上传文件
    async actionUploadFile(file) {
      const formData = new FormData()
      formData.append('file', file)
      this.spinning = true
      const result = await this.$server.dataAccess.actionUploadExcelFile(formData)
        .catch(() => {
          this.spinning = false
        })
      if (result.code === 200) {
        if (result.rows && result.rows.length === 0) {
          this.spinning = false
          return this.$message.error('解析失败')
        }
        this.$message.success('解析成功')
        // 临时方案
        this.fileList[0] = file
        // this.fileList.push(file)

        // 处理掉文件后缀
        const fileInfo = {
          id: file.id,
          name: file.name
        }
        const name = fileInfo.name
        fileInfo.name = name.slice(0, name.lastIndexOf('.'))
        this.fileInfoList.push(fileInfo)

        const currentIndex = this.currentFileList.length - 1
        const database = new MapSheet(result.rows[0].mapSheet)

        // 新增文件未保存前不能查看库表结构
        this.$store.dispatch('dataAccess/setFirstFinished', false)
        this.$set(this.databaseList, currentIndex, database)
        this.$nextTick(() => {
          this.handleGetDataBase(currentIndex)
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    // 替换文件
    async actionReplaceFile(file) {
      const formData = new FormData()
      let result = null
      // 替换未入库文件
      const flag = isNaN(this.replaceFile.info.id)
      if (flag) {
        formData.append('file', file)
        this.spinning = true
        result = await this.$server.dataAccess.actionUploadExcelFile(formData)
          .catch(() => {
            this.clearReplaceFile()
          })
          .finally(() => {
            this.spinning = false
          })
      } else {
        formData.append('fileList[0]', file)
        formData.append('replaceDatabaseId', this.replaceFile.info.id)
        this.spinning = true
        result = await this.$server.dataAccess.actionReplaceExcelFile(formData)
          .catch(() => {
            this.clearReplaceFile()
          })
          .finally(() => {
            this.spinning = false
          })
      }
      if (result.code === 200) {
        if (result.rows && result.rows.length === 0) {
          this.spinning = false
          return this.$message.error('解析失败')
        }
        this.$message.success('解析成功')

        const currentIndex = this.replaceFile.index
        // 如果是新增的文件, 直接替换
        let isNewFile = false
        for (let i = 0; i < this.fileList.length; i++) {
          const item = this.fileList[i]
          if (item.id === this.replaceFile.info.id) {
            isNewFile = true
            this.fileList.splice(i, 1, file)
            const name = file.name
            this.fileInfoList[currentIndex] = {
              id: file.id,
              name: name.slice(0, name.lastIndexOf('.'))
            }
            break
          }
        }
        // if (!isNewFile) {
        //   this.fileList.push(file)
        // }
        // 临时方案
        this.fileList[0] = file

        const database = new MapSheet(result.rows[0].mapSheet)
        this.$set(this.databaseList, currentIndex, database)
        this.$nextTick(() => {
          this.handleGetDataBase(currentIndex)
        })
      } else {
        this.$message.error(result.msg)
      }
      // 当前版本暂不清空, 保留替换历史
      // this.clearReplaceFile()
    },
    // 渲染当前表格
    async renderCurrentTable(index) {
      // 写入表头信息
      let table = this.tableList[index]
      // 判断是否处理过表格信息(处理之后的是Array类型), 没有则调接口获取信息并处理
      if (!Array.isArray(table)) {
        if (!this.sheetList[index]) return
        const res = await this.$server.dataAccess.getExcelFileTableInfo(this.sheetList[index].id)
        if (res.code === 200) {
          if (!this.sheetList[index]) return
          const data = res.rows[0]
          // 将结果处理成mapSheet结构
          const sheetName = this.sheetList[index].name
          const head = data.nameSheet[sheetName]
          const tableInfo = data.mapSheet[sheetName]
          const newTable = new Array(head)
          table = newTable.concat(tableInfo)

          // 写入列表, 下次点击不调用接口
          this.currentDataBase.addTable(table, index)
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
      } else if (this.currentFieldList.length === 0) {
        return this.$message.error('请上传文件')
      }
      this.$refs.fileForm.validate((pass, obj) => {
        if (pass) {
          this.loading = true
          const formData = new FormData()
          this.fileList.map((file, index) => {
            formData.append('fileList[' + index + ']', file)
          })
          formData.append('databaseName', this.databaseName)
          formData.append('sourceSaveInput.name', this.form.name)
          formData.append('sourceSaveInput.type', 11)
          formData.append('sourceSaveInput.parentId', this.parentId || 0)
          formData.append('sourceSaveInput.id', this.modelId || 0)
          if (this.deleteIdList.length > 0) {
            formData.append('operation', 0)
            this.deleteIdList.map((id, index) => {
              if (!isNaN(id)) {
                formData.append('databasesIdList[' + index + ']', id)
              }
            })
          } else if (this.replaceFile.index > -1 && !isNaN(this.replaceFile.info.id)) {
            formData.append('operation', 1)
            formData.append('replaceDatabaseIdList[0]', this.replaceFile.info.id)
          }

          this.$server.dataAccess.saveExcelInfo(formData)
            .then(result => {
              console.log(result)
              if (result.code === 200) {
                this.$message.success('保存成功')
                this.$store.dispatch('dataAccess/setFirstFinished', true)
                this.$store.dispatch('dataAccess/getMenuList')
                this.$store.dispatch('dataAccess/setFirstFinished', true)
                this.$store.dispatch('dataAccess/setModelName', this.form.name)
                // this.$store.dispatch('dataAccess/setParentId', 0)
                this.$store.dispatch('dataAccess/setModelId', result.data.datasource.id)
                this.$store.commit('common/SET_PRIVILEGES', result.data.datasource.privileges)
                this.fileInfoList = result.data.sourceDatabases
                // 保存后清空列表
                this.fileList = []
                this.deleteIdList = []
                // 刷新文件id(替换成数据库生成的真实id)
                const databases = result.data.sourceDatabases
                this.fileInfoList.map(item => {
                  const target = databases.find(data => data.name === item.name)
                  if (target) {
                    item.id = target.id
                  }
                })
              } else {
                this.$message.error(result.msg)
              }
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
